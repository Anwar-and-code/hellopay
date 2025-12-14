import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderPaymentPlan } from "./OrderPaymentPlan";
import { Payments } from "./Payments";

@Index("fk_installments_plan", ["orderPaymentPlanId"], {})
@Entity("installments", { schema: "hellopay" })
export class Installments {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "order_payment_plan_id", unsigned: true })
  orderPaymentPlanId: string;

  @Column("int", { name: "installment_number" })
  installmentNumber: number;

  @Column("decimal", { name: "amount", precision: 10, scale: 2 })
  amount: string;

  @Column("timestamp", { name: "due_date" })
  dueDate: Date;

  @Column("enum", {
    name: "status",
    enum: ["PENDING", "PAID", "LATE"],
    default: () => "'PENDING'",
  })
  status: "PENDING" | "PAID" | "LATE";

  @Column("timestamp", { name: "paid_at", nullable: true })
  paidAt: Date | null;

  @ManyToOne(
    () => OrderPaymentPlan,
    (orderPaymentPlan) => orderPaymentPlan.installments,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "order_payment_plan_id", referencedColumnName: "id" }])
  orderPaymentPlan: OrderPaymentPlan;

  @OneToMany(() => Payments, (payments) => payments.installment)
  payments: Payments[];
}
