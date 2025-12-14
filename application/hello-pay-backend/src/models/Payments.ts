import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Installments } from "./Installments";
import { Orders } from "./Orders";
import { Users } from "./Users";

@Index("fk_payments_installment", ["installmentId"], {})
@Index("fk_payments_order", ["orderId"], {})
@Index("fk_payments_user", ["userId"], {})
@Entity("payments", { schema: "hellopay" })
export class Payments {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: string;

  @Column("bigint", { name: "order_id", unsigned: true })
  orderId: string;

  @Column("bigint", { name: "installment_id", nullable: true, unsigned: true })
  installmentId: string | null;

  @Column("decimal", { name: "amount", precision: 10, scale: 2 })
  amount: string;

  @Column("varchar", { name: "payement_type", nullable: true, length: 255 })
  payementType: string | null;

  @Column("enum", {
    name: "payment_method",
    enum: ["MOBILE_MONEY", "CARD", "CASH"],
  })
  paymentMethod: "MOBILE_MONEY" | "CARD" | "CASH";

  @Column("enum", { name: "status", enum: ["SUCCESS", "FAILED", "PENDING"], default: () => "'PENDING'", })
  status: "PENDING" | "FAILED" | "SUCCESS";

  @Column("varchar", { name: "transaction_id", nullable: true, length: 255 })
  transactionId: string | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Installments, (installments) => installments.payments, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "installment_id", referencedColumnName: "id" }])
  installment: Installments;

  @ManyToOne(() => Orders, (orders) => orders.payments, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "order_id", referencedColumnName: "id" }])
  order: Orders;

  @ManyToOne(() => Users, (users) => users.payments, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
