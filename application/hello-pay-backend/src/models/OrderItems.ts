import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Orders } from "./Orders";
import { Products } from "./Products";

@Index("fk_order_items_order", ["orderId"], {})
@Index("fk_order_items_product", ["productId"], {})
@Entity("order_items", { schema: "hellopay" })
export class OrderItems {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "order_id", unsigned: true })
  orderId: string;

  @Column("bigint", { name: "product_id", unsigned: true })
  productId: string;

  @Column("int", { name: "quantity" })
  quantity: number;

  @Column("decimal", { name: "unit_price", precision: 10, scale: 2 })
  unitPrice: string;

  @ManyToOne(() => Orders, (orders) => orders.orderItems, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "order_id", referencedColumnName: "id" }])
  order: Orders;

  @ManyToOne(() => Products, (products) => products.orderItems, {
    onDelete: "RESTRICT",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;
}
