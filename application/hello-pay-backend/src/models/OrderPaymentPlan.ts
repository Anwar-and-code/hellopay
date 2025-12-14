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
import { Installments } from "./Installments";
import { Orders } from "./Orders";
import { PaymentPlans } from "./PaymentPlans";

@Index("fk_opp_plan", ["paymentPlanId"], {})
@Index("order_id", ["orderId"], { unique: true })
@Entity("order_payment_plan", { schema: "hellopay" })
export class OrderPaymentPlan {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "order_id", unique: true, unsigned: true })
  orderId: string;

  @Column("bigint", { name: "payment_plan_id", nullable: true, unsigned: true })
  paymentPlanId: string | null;

  @Column("decimal", { name: "total_amount", precision: 10, scale: 2 })
  totalAmount: string;

  @Column("enum", {
    name: "status",
    enum: ["PENDING", "PARTIALLY_PAID", "PAID"],
    default: () => "'PENDING'",
  })
  status: "PENDING" | "PARTIALLY_PAID" | "PAID";

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @OneToMany(
    () => Installments,
    (installments) => installments.orderPaymentPlan
  )
  installments: Installments[];

  @OneToOne(() => Orders, (orders) => orders.orderPaymentPlan, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "order_id", referencedColumnName: "id" }])
  order: Orders;

  @ManyToOne(
    () => PaymentPlans,
    (paymentPlans) => paymentPlans.orderPaymentPlans,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "payment_plan_id", referencedColumnName: "id" }])
  paymentPlan: PaymentPlans;
}
