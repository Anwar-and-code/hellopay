import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderItems } from "./OrderItems";
import { Categories } from "./Categories";
import { Suppliers } from "./Suppliers";

@Index("fk_products_category", ["categoryId"], {})
@Index("fk_products_supplier", ["supplierId"], {})
@Entity("products", { schema: "hellopay" })
export class Products {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "supplier_id", nullable: true, unsigned: true })
  supplierId: string | null;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("decimal", { name: "price", precision: 10, scale: 2 })
  price: string;

  @Column("int", { name: "stock", default: () => "'0'" })
  stock: number;

  @Column("text", { name: "image_url", nullable: true })
  imageUrl: string | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("bigint", { name: "category_id", nullable: true, unsigned: true })
  categoryId: string | null;

  @OneToMany(() => OrderItems, (orderItems) => orderItems.product)
  orderItems: OrderItems[];

  @ManyToOne(() => Categories, (categories) => categories.products, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "id" }])
  category: Categories;

  @ManyToOne(() => Suppliers, (suppliers) => suppliers.products, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "supplier_id", referencedColumnName: "id" }])
  supplier: Suppliers;
}
