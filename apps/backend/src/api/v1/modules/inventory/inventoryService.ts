import { Types } from "mongoose";
import { InventoryItem } from "../../models/InventoryItem.js";
import { InventoryTransaction } from "../../models/InventoryTransaction.js";
import {
  InventoryTransactionType,
  InventoryReferenceType,
} from "../../shared/interface/IInventoryTransaction.js";
import logger from "../../config/logger.js";

/**
 * Inventory Service
 * Handles all inventory-related business logic
 */
const inventoryService = {
  /**
   * Get all inventory items for a company
   */
  getAllItems: async (companyId: string | Types.ObjectId) => {
    try {
      const items = await InventoryItem.find({ companyId })
        .populate("inventoryAccountId", "accountCode accountName")
        .populate("cogsAccountId", "accountCode accountName")
        .populate("incomeAccountId", "accountCode accountName")
        .sort({ itemName: 1 });
      return items;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "get-all-inventory-items",
        companyId: companyId.toString(),
      });
      throw error;
    }
  },

  /**
   * Get active inventory items
   */
  getActiveItems: async (companyId: string | Types.ObjectId) => {
    try {
      const items = await InventoryItem.findActive(
        new Types.ObjectId(companyId)
      );
      return items;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "get-active-inventory-items",
        companyId: companyId.toString(),
      });
      throw error;
    }
  },

  /**
   * Get single inventory item by ID
   */
  getItemById: async (
    companyId: string | Types.ObjectId,
    itemId: string | Types.ObjectId
  ) => {
    try {
      const item = await InventoryItem.findOne({
        _id: itemId,
        companyId,
      })
        .populate("inventoryAccountId", "accountCode accountName")
        .populate("cogsAccountId", "accountCode accountName")
        .populate("incomeAccountId", "accountCode accountName");

      if (!item) {
        throw new Error("Inventory item not found");
      }
      return item;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "get-inventory-item-by-id",
        companyId: companyId.toString(),
        itemId: itemId.toString(),
      });
      throw error;
    }
  },

  /**
   * Get inventory item by item code
   */
  getItemByCode: async (
    companyId: string | Types.ObjectId,
    itemCode: string
  ) => {
    try {
      const item = await InventoryItem.findByItemCode(
        new Types.ObjectId(companyId),
        itemCode
      );
      if (!item) {
        throw new Error("Inventory item not found");
      }
      return item;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "get-inventory-item-by-code",
        companyId: companyId.toString(),
        itemCode,
      });
      throw error;
    }
  },

  /**
   * Get inventory items by category
   */
  getItemsByCategory: async (
    companyId: string | Types.ObjectId,
    category: string
  ) => {
    try {
      const items = await InventoryItem.findByCategory(
        new Types.ObjectId(companyId),
        category
      );
      return items;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "get-inventory-items-by-category",
        companyId: companyId.toString(),
        category,
      });
      throw error;
    }
  },

  /**
   * Get items needing reorder
   */
  getItemsNeedingReorder: async (companyId: string | Types.ObjectId) => {
    try {
      const items = await InventoryItem.findNeedingReorder(
        new Types.ObjectId(companyId)
      );
      return items;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "get-items-needing-reorder",
        companyId: companyId.toString(),
      });
      throw error;
    }
  },

  /**
   * Search inventory items
   */
  searchItems: async (
    companyId: string | Types.ObjectId,
    searchTerm: string
  ) => {
    try {
      const items = await InventoryItem.searchItems(
        new Types.ObjectId(companyId),
        searchTerm
      );
      return items;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "search-inventory-items",
        companyId: companyId.toString(),
        searchTerm,
      });
      throw error;
    }
  },

  /**
   * Create new inventory item
   */
  createItem: async (
    companyId: string | Types.ObjectId,
    itemData: {
      itemCode: string;
      itemName: string;
      description?: string;
      category: string;
      unit: string;
      quantityOnHand?: number;
      reorderLevel?: number;
      unitCost: number;
      sellingPrice: number;
      inventoryAccountId: string | Types.ObjectId;
      cogsAccountId: string | Types.ObjectId;
      incomeAccountId: string | Types.ObjectId;
    }
  ) => {
    try {
      // Check if item code already exists
      const existingItem = await InventoryItem.findByItemCode(
        new Types.ObjectId(companyId),
        itemData.itemCode
      );

      if (existingItem) {
        throw new Error(
          `Item with code ${itemData.itemCode} already exists for this company`
        );
      }

      const item = new InventoryItem({
        ...itemData,
        companyId,
        quantityOnHand: itemData.quantityOnHand ?? 0,
        reorderLevel: itemData.reorderLevel ?? 0,
      });

      await item.save();

      logger.info("Inventory item created successfully", {
        itemId: item._id,
        itemCode: item.itemCode,
        companyId: companyId.toString(),
      });

      return item;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "create-inventory-item",
        companyId: companyId.toString(),
      });
      throw error;
    }
  },

  /**
   * Update inventory item
   */
  updateItem: async (
    companyId: string | Types.ObjectId,
    itemId: string | Types.ObjectId,
    updateData: Partial<{
      itemName: string;
      description: string;
      category: string;
      unit: string;
      reorderLevel: number;
      unitCost: number;
      sellingPrice: number;
      inventoryAccountId: string | Types.ObjectId;
      cogsAccountId: string | Types.ObjectId;
      incomeAccountId: string | Types.ObjectId;
      isActive: boolean;
    }>
  ) => {
    try {
      const item = await InventoryItem.findOneAndUpdate(
        { _id: itemId, companyId },
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate("inventoryAccountId", "accountCode accountName")
        .populate("cogsAccountId", "accountCode accountName")
        .populate("incomeAccountId", "accountCode accountName");

      if (!item) {
        throw new Error("Inventory item not found");
      }

      logger.info("Inventory item updated successfully", {
        itemId: item._id,
        itemCode: item.itemCode,
        companyId: companyId.toString(),
      });

      return item;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "update-inventory-item",
        companyId: companyId.toString(),
        itemId: itemId.toString(),
      });
      throw error;
    }
  },

  /**
   * Delete (deactivate) inventory item
   */
  deleteItem: async (
    companyId: string | Types.ObjectId,
    itemId: string | Types.ObjectId
  ) => {
    try {
      const item = await InventoryItem.findOneAndUpdate(
        { _id: itemId, companyId },
        { $set: { isActive: false } },
        { new: true }
      );

      if (!item) {
        throw new Error("Inventory item not found");
      }

      logger.info("Inventory item deactivated successfully", {
        itemId: item._id,
        itemCode: item.itemCode,
        companyId: companyId.toString(),
      });

      return item;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "delete-inventory-item",
        companyId: companyId.toString(),
        itemId: itemId.toString(),
      });
      throw error;
    }
  },

  /**
   * Adjust inventory quantity
   */
  adjustQuantity: async (
    companyId: string | Types.ObjectId,
    itemId: string | Types.ObjectId,
    adjustment: number,
    reason: string,
    userId: string | Types.ObjectId
  ) => {
    try {
      const item = await InventoryItem.findOne({
        _id: itemId,
        companyId,
      });

      if (!item) {
        throw new Error("Inventory item not found");
      }

      // Adjust quantity using instance method
      await item.adjustQuantity(adjustment, reason);

      // Create inventory transaction
      const transaction = new InventoryTransaction({
        companyId,
        inventoryItemId: itemId,
        transactionType: InventoryTransactionType.ADJUSTMENT,
        transactionDate: new Date(),
        referenceType: InventoryReferenceType.JOURNAL_ENTRY,
        referenceId: new Types.ObjectId(), // Placeholder - should be journal entry ID
        quantityIn: adjustment > 0 ? adjustment : 0,
        quantityOut: adjustment < 0 ? Math.abs(adjustment) : 0,
        unitCost: item.unitCost,
        totalValue: Math.abs(adjustment) * item.unitCost,
        balanceAfter: item.quantityOnHand,
        notes: reason,
        createdBy: userId,
      });

      await transaction.save();

      logger.info("Inventory quantity adjusted successfully", {
        itemId: item._id,
        adjustment,
        newQuantity: item.quantityOnHand,
        companyId: companyId.toString(),
      });

      return item;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "adjust-inventory-quantity",
        companyId: companyId.toString(),
        itemId: itemId.toString(),
        adjustment,
      });
      throw error;
    }
  },

  /**
   * Get total inventory value
   */
  getTotalInventoryValue: async (companyId: string | Types.ObjectId) => {
    try {
      const totalValue = await InventoryItem.getTotalInventoryValue(
        new Types.ObjectId(companyId)
      );
      return totalValue;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "get-total-inventory-value",
        companyId: companyId.toString(),
      });
      throw error;
    }
  },

  /**
   * Get inventory transactions for an item
   */
  getItemTransactions: async (
    companyId: string | Types.ObjectId,
    itemId: string | Types.ObjectId
  ) => {
    try {
      const transactions = await InventoryTransaction.find({
        inventoryItemId: new Types.ObjectId(itemId),
        companyId: new Types.ObjectId(companyId),
      })
        .populate("createdBy", "first_name last_name email")
        .populate("inventoryItemId", "itemCode itemName")
        .sort({ transactionDate: -1 });

      return transactions;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "get-item-transactions",
        companyId: companyId.toString(),
        itemId: itemId.toString(),
      });
      throw error;
    }
  },

  /**
   * Get inventory movement summary
   */
  getMovementSummary: async (
    itemId: string | Types.ObjectId,
    startDate: Date,
    endDate: Date
  ) => {
    try {
      const summary = await InventoryTransaction.getMovementSummary(
        new Types.ObjectId(itemId),
        startDate,
        endDate
      );
      return summary;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "get-inventory-movement-summary",
        itemId: itemId.toString(),
      });
      throw error;
    }
  },

  /**
   * Calculate COGS for an item
   */
  calculateCOGS: async (
    itemId: string | Types.ObjectId,
    startDate: Date,
    endDate: Date
  ) => {
    try {
      const cogs = await InventoryTransaction.calculateCOGS(
        new Types.ObjectId(itemId),
        startDate,
        endDate
      );
      return cogs;
    } catch (error) {
      logger.logError(error as Error, {
        operation: "calculate-cogs",
        itemId: itemId.toString(),
      });
      throw error;
    }
  },

  /**
   * Get inventory valuation report
   */
  getInventoryValuation: async (companyId: string | Types.ObjectId) => {
    try {
      const items = await InventoryItem.find({ companyId, isActive: true })
        .select(
          "itemCode itemName category quantityOnHand unitCost sellingPrice"
        )
        .sort({ category: 1, itemName: 1 });

      const valuation = items.map((item: any) => ({
        itemCode: item.itemCode,
        itemName: item.itemName,
        category: item.category,
        quantityOnHand: item.quantityOnHand,
        unitCost: item.unitCost,
        sellingPrice: item.sellingPrice,
        inventoryValue: item.quantityOnHand * item.unitCost,
        potentialRevenue: item.quantityOnHand * item.sellingPrice,
        potentialProfit:
          item.quantityOnHand * (item.sellingPrice - item.unitCost),
      }));

      const totals = valuation.reduce(
        (acc: any, item: any) => ({
          totalInventoryValue: acc.totalInventoryValue + item.inventoryValue,
          totalPotentialRevenue:
            acc.totalPotentialRevenue + item.potentialRevenue,
          totalPotentialProfit: acc.totalPotentialProfit + item.potentialProfit,
        }),
        {
          totalInventoryValue: 0,
          totalPotentialRevenue: 0,
          totalPotentialProfit: 0,
        }
      );

      return {
        items: valuation,
        totals,
      };
    } catch (error) {
      logger.logError(error as Error, {
        operation: "get-inventory-valuation",
        companyId: companyId.toString(),
      });
      throw error;
    }
  },
};

export default inventoryService;
