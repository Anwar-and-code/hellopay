import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Orders } from "./Orders";

@Index("fk_deliveries_order", ["orderId"], {})
@Entity("deliveries", { schema: "hellopay" })
export class Deliveries {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "order_id", unsigned: true })
  orderId: string;

  @Column("enum", {
    name: "delivery_status",
    enum: ["PENDING", "SHIPPED", "DELIVERED"],
    default: () => "'PENDING'",
  })
  deliveryStatus: "PENDING" | "SHIPPED" | "DELIVERED";

  @Column("timestamp", { name: "delivered_at", nullable: true })
  deliveredAt: Date | null;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;


  @Column("text", { name: "lieux_prise_en_charge", nullable: true })
  lieuxPriseEnCharge: string | null;



  @Column("text", { name: "lieux_livraison", nullable: true })
  lieuxLivraison: string | null;

  @ManyToOne(() => Orders, (orders) => orders.deliveries, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "order_id", referencedColumnName: "id" }])
  order: Orders;


  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}
