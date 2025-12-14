import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Deliveries } from "./Deliveries";
import { OrderItems } from "./OrderItems";
import { OrderPaymentPlan } from "./OrderPaymentPlan";
import { Users } from "./Users";
import { Payments } from "./Payments";

@Index("fk_orders_user", ["userId"], {})
@Entity("orders", { schema: "hellopay" })
export class Orders {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: string;

  @Column("decimal", { name: "total_amount", precision: 10, scale: 2 })
  totalAmount: string;

  @Column("enum", { name: "payment_mode", enum: ["COD", "INSTALLMENT"] })
  paymentMode: "COD" | "INSTALLMENT";

  @Column("enum", {
    name: "status",
    enum: ["PENDING", "PARTIALLY_PAID", "PAID", "DELIVERED", "CANCELLED"],
    default: () => "'PENDING'",
  })
  status: "PENDING" | "PARTIALLY_PAID" | "PAID" | "DELIVERED" | "CANCELLED";

  @Column("varchar", { name: "code", nullable: true, length: 255 })
  code: string | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @OneToMany(() => Deliveries, (deliveries) => deliveries.order)
  deliveries: Deliveries[];

  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  orderItems: OrderItems[];

  @OneToOne(
    () => OrderPaymentPlan,
    (orderPaymentPlan) => orderPaymentPlan.order
  )
  orderPaymentPlan: OrderPaymentPlan;

  @ManyToOne(() => Users, (users) => users.orders, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @OneToMany(() => Payments, (payments) => payments.order)
  payments: Payments[];
}
