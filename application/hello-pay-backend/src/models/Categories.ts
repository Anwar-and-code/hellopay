import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Products } from "./Products";

@Index("slug", ["slug"], { unique: true })
@Entity("categories", { schema: "hellopay" })
export class Categories {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "slug", unique: true, length: 255 })
  slug: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @OneToMany(() => Products, (products) => products.category)
  products: Products[];
}
