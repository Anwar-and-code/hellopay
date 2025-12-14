import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Orders } from "./Orders";
import { Payments } from "./Payments";

@Index("email", ["email"], { unique: true })
@Entity("users", { schema: "hellopay" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "email", unique: true, length: 255 ,})
  email: string;

  @Column("varchar", { name: "phone", unique: true,nullable: true, length: 50 })
  phone: string | null;

  @Column("text", { name: "password_hash" })
  passwordHash: string;

  @Column("enum", {
    name: "role",
    enum: ["admin", "client"],
    default: () => "'client'",
  })
  role: "admin" | "client";

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp", { name: "date_naissance", nullable: true })
  dateNaissance: Date | null;

  @Column("varchar", { name: "nom", nullable: true, length: 150 })
  nom: string | null;

  @Column("varchar", { name: "prenom", nullable: true, length: 150 })
  prenom: string | null;

  @Column("varchar", { name: "job", nullable: true, length: 45 })
  job: string | null;

  @Column("varchar", { name: "habitation", nullable: true, length: 45 })
  habitation: string | null;

  @OneToMany(() => Orders, (orders) => orders.user)
  orders: Orders[];

  @OneToMany(() => Payments, (payments) => payments.user)
  payments: Payments[];
}
