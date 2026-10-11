import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { AdminCustomersClient } from "./customers-client";

export const metadata: Metadata = {
  title: "Customers — Admin | Oviyas Crochet",
};

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  shippingAddress: Record<string, unknown>;
  trackingNumber?: string | null;
  courierName?: string | null;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string | null;
  }>;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  isRegistered: boolean;
  registeredAt?: string;
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
  totalSpent: number;
  totalOrders: number;
  lastOrderAt?: string;
}

export interface CustomersAdminData {
  customers: Customer[];
  stats: {
    totalCustomers: number;
    totalOrders: number;
    totalRevenue: number;
    repeatCustomers: number;
  };
}

async function getCustomersData(): Promise<CustomersAdminData> {
  try {
    // 1. Fetch all orders (excluding unpaid/abandoned checkout orders)
    const orders = await prisma.order.findMany({
      where: {
        status: { not: "PENDING_PAYMENT" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });

    // 2. Fetch all registered customer accounts
    const users = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: { addresses: true },
    });

    // 3. Aggregate unique customers by lowercase email
    const customerMap = new Map<string, Customer>();

    // Seed with registered users
    for (const u of users) {
      const emailKey = u.email.toLowerCase().trim();
      customerMap.set(emailKey, {
        id: u.id,
        email: u.email,
        name: u.name,
        phone: u.phone || "",
        isRegistered: true,
        registeredAt: u.createdAt.toISOString(),
        addresses: u.addresses.map((a) => ({
          fullName: a.fullName,
          phone: a.phone,
          line1: a.line1,
          line2: a.line2,
          city: a.city,
          state: a.state,
          pincode: a.pincode,
        })),
        orders: [],
        totalSpent: 0,
        totalOrders: 0,
      });
    }

    // Attach all orders & incorporate guest customers
    for (const o of orders) {
      const emailKey = o.customerEmail.toLowerCase().trim();
      let customer = customerMap.get(emailKey);

      if (!customer) {
        customer = {
          id: o.userId || `guest_${o.customerEmail}`,
          email: o.customerEmail,
          name: o.customerName,
          phone: o.customerPhone,
          isRegistered: false,
          addresses: [],
          orders: [],
          totalSpent: 0,
          totalOrders: 0,
        };
        customerMap.set(emailKey, customer);
      } else {
        if (!customer.phone && o.customerPhone) {
          customer.phone = o.customerPhone;
        }
        if ((!customer.name || customer.name === "Customer") && o.customerName) {
          customer.name = o.customerName;
        }
      }

      // Add address from order if not already in customer address list
      const shipAddr = o.shippingAddress as Record<string, unknown> | null;
      if (shipAddr && typeof shipAddr === "object" && shipAddr.line1) {
        const addrExists = customer.addresses.some(
          (a) => a.line1 === shipAddr.line1 && a.pincode === shipAddr.pincode
        );
        if (!addrExists) {
          customer.addresses.push({
            fullName: (shipAddr.fullName as string) || o.customerName,
            phone: (shipAddr.phone as string) || o.customerPhone,
            line1: (shipAddr.line1 as string) || "",
            line2: (shipAddr.line2 as string) || null,
            city: (shipAddr.city as string) || "",
            state: (shipAddr.state as string) || "",
            pincode: (shipAddr.pincode as string) || "",
          });
        }
      }

      customer.orders.push({
        id: o.id,
        orderNumber: o.orderNumber,
        total: Number(o.total),
        status: o.status as string,
        paymentStatus: o.paymentStatus as string,
        paymentMethod: o.paymentMethod as string,
        createdAt: o.createdAt.toISOString(),
        shippingAddress: (o.shippingAddress as Record<string, unknown>) || {},
        trackingNumber: o.trackingNumber,
        courierName: o.courierName,
        items: o.items.map((i) => ({
          id: i.id,
          name: i.nameSnapshot,
          quantity: i.quantity,
          price: Number(i.finalUnitPrice),
          image: i.imageSnapshot,
        })),
      });
    }

    // Process customer calculations & ensure orders are strictly sorted in DESC order
    const customerList: Customer[] = Array.from(customerMap.values()).map((c) => {
      // Sort orders in DESCENDING order by createdAt
      c.orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const totalSpent = c.orders.reduce((sum, ord) => sum + ord.total, 0);
      const lastOrderAt = c.orders[0]?.createdAt;

      return {
        ...c,
        totalSpent,
        totalOrders: c.orders.length,
        lastOrderAt,
      };
    });

    // Sort customer list: most recent order activity first, then highest spend
    customerList.sort((a, b) => {
      if (a.lastOrderAt && b.lastOrderAt) {
        return new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime();
      }
      if (a.lastOrderAt) return -1;
      if (b.lastOrderAt) return 1;
      return b.totalSpent - a.totalSpent;
    });

    const totalRevenue = customerList.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = customerList.reduce((sum, c) => sum + c.totalOrders, 0);
    const repeatCustomers = customerList.filter((c) => c.totalOrders > 1).length;

    return {
      customers: customerList,
      stats: {
        totalCustomers: customerList.length,
        totalOrders,
        totalRevenue,
        repeatCustomers,
      },
    };
  } catch (err) {
    console.error("[CUSTOMERS_GET_ERROR]", err);
    return {
      customers: [],
      stats: {
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        repeatCustomers: 0,
      },
    };
  }
}

export default async function AdminCustomersPage() {
  const data = await getCustomersData();

  return (
    <div style={{ padding: "20px var(--pad-mobile) 40px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 className="text-section" style={{ margin: "0 0 6px" }}>Customers</h1>
        <p style={{ color: "var(--mute)", fontSize: 14, margin: 0 }}>
          Manage your customer base and review individual purchase histories.
        </p>
      </div>
      <AdminCustomersClient data={data} />
    </div>
  );
}
