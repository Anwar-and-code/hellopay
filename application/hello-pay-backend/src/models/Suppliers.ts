import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "./Products";

@Entity("suppliers", { schema: "hellopay" })
export class Suppliers {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "address", nullable: true, length: 255 })
  address: string | null;

  @Column("varchar", { name: "contact", nullable: true, length: 100 })
  contact: string | null;

  @Column("varchar", { name: "location", nullable: true, length: 100 })
  location: string | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @OneToMany(() => Products, (products) => products.supplier)
  products: Products[];
}
