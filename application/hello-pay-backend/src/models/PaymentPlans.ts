import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderPaymentPlan } from "./OrderPaymentPlan";

@Entity("payment_plans", { schema: "hellopay" })
export class PaymentPlans {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("int", { name: "number_of_installments" })
  numberOfInstallments: number;

  @Column("int", { name: "interval_in_days", default: () => "'30'" })
  intervalInDays: number;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @OneToMany(
    () => OrderPaymentPlan,
    (orderPaymentPlan) => orderPaymentPlan.paymentPlan
  )
  orderPaymentPlans: OrderPaymentPlan[];
}
