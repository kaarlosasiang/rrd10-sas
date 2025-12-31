import { Document, Types } from "mongoose";

/**
 * Inventory Item Document Interface
 */
export interface IInventoryItem {
  _id: Types.ObjectId;
  companyId: Types.ObjectId;
  itemCode: string; // SKU or product code
  itemName: string;
  description?: string;
  category: string;
  unit: string; // 'pcs', 'kg', 'box'
  quantityOnHand: number;
  reorderLevel: number;
  unitCost: number; // Cost of goods
  sellingPrice: number;
  inventoryAccountId: Types.ObjectId; // Reference to Account (Asset)
  cogsAccountId: Types.ObjectId; // Reference to Account (Expense - Cost of Goods Sold)
  incomeAccountId: Types.ObjectId; // Reference to Account (Revenue)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Inventory Item Instance Methods
 */
export interface IInventoryItemMethods {
  adjustQuantity(
    adjustment: number,
    reason: string
  ): Promise<IInventoryItemDocument>;
  updateCost(newCost: number): Promise<IInventoryItemDocument>;
  updateSellingPrice(newPrice: number): Promise<IInventoryItemDocument>;
}

/**
 * Inventory Item Static Methods
 */
export interface IInventoryItemModel {
  findActive(companyId: Types.ObjectId): Promise<IInventoryItemDocument[]>;
  findByItemCode(
    companyId: Types.ObjectId,
    itemCode: string
  ): Promise<IInventoryItemDocument | null>;
  findByCategory(
    companyId: Types.ObjectId,
    category: string
  ): Promise<IInventoryItemDocument[]>;
  findNeedingReorder(
    companyId: Types.ObjectId
  ): Promise<IInventoryItemDocument[]>;
  searchItems(
    companyId: Types.ObjectId,
    searchTerm: string
  ): Promise<IInventoryItemDocument[]>;
  getTotalInventoryValue(companyId: Types.ObjectId): Promise<number>;
}

/**
 * Inventory Item Document (Mongoose)
 */
export interface IInventoryItemDocument
  extends Omit<IInventoryItem, "_id">,
    IInventoryItemMethods,
    Document {}
