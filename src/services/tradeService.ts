
import { supabase } from "@/integrations/supabase/client";
import { Trade, TradeFormData } from "../types/trade";
import { calculatePnL, calculatePnLPercentage } from "../utils/tradeCalculations";

// Service to handle trade operations
class TradeService {
  // Get all trades for the current user
  async getAllTrades(): Promise<Trade[]> {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('entry_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching trades:", error);
      throw error;
    }
    
    return data as Trade[];
  }

  // Get a trade by ID
  async getTradeById(id: string): Promise<Trade | null> {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching trade:", error);
      return null;
    }
    
    return data as Trade;
  }

  // Add a new trade
  async addTrade(tradeData: TradeFormData): Promise<Trade> {
    let screenshotUrl = null;
    
    // Upload screenshot if provided
    if (tradeData.screenshot) {
      const fileExt = tradeData.screenshot.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase
        .storage
        .from('trade-screenshots')
        .upload(filePath, tradeData.screenshot);

      if (uploadError) {
        console.error("Error uploading screenshot:", uploadError);
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('trade-screenshots')
        .getPublicUrl(filePath);
        
      screenshotUrl = urlData.publicUrl;
    }
    
    // Calculate profit/loss if trade is closed
    let profitLoss = null;
    let profitLossPercentage = null;
    
    if (tradeData.status === 'closed' && tradeData.exitPrice) {
      profitLoss = calculatePnL(
        tradeData.entryPrice,
        tradeData.exitPrice,
        tradeData.quantity,
        tradeData.direction
      );
      
      profitLossPercentage = calculatePnLPercentage(
        tradeData.entryPrice,
        tradeData.exitPrice,
        tradeData.direction
      );
    }
    
    // Direction mapping
    const direction = tradeData.direction === 'buy' ? 'long' : 'short';
    
    // Insert new trade
    const { data, error } = await supabase
      .from('trades')
      .insert({
        symbol: tradeData.symbol,
        direction: direction,
        entry_price: tradeData.entryPrice,
        exit_price: tradeData.exitPrice || null,
        position_size: tradeData.quantity,
        entry_date: tradeData.date,
        exit_date: tradeData.status === 'closed' ? new Date() : null,
        profit_loss: profitLoss,
        profit_loss_percentage: profitLossPercentage,
        strategy: tradeData.marketCategory,
        notes: tradeData.notes,
        tags: tradeData.tags,
        status: tradeData.status,
        screenshot_url: screenshotUrl
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding trade:", error);
      throw error;
    }
    
    return data as Trade;
  }

  // Update an existing trade
  async updateTrade(id: string, tradeData: Partial<TradeFormData>): Promise<Trade | null> {
    // Get current trade
    const currentTrade = await this.getTradeById(id);
    if (!currentTrade) return null;
    
    let updatedData: any = {};
    
    // Process screenshot if a new one is provided
    if (tradeData.screenshot) {
      const fileExt = tradeData.screenshot.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase
        .storage
        .from('trade-screenshots')
        .upload(filePath, tradeData.screenshot);

      if (uploadError) {
        console.error("Error uploading screenshot:", uploadError);
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase
        .storage
        .from('trade-screenshots')
        .getPublicUrl(filePath);
        
      updatedData.screenshot_url = urlData.publicUrl;
    }
    
    // Map fields from TradeFormData to database fields
    if (tradeData.symbol !== undefined) updatedData.symbol = tradeData.symbol;
    if (tradeData.direction !== undefined) {
      updatedData.direction = tradeData.direction === 'buy' ? 'long' : 'short';
    }
    if (tradeData.entryPrice !== undefined) updatedData.entry_price = tradeData.entryPrice;
    if (tradeData.exitPrice !== undefined) updatedData.exit_price = tradeData.exitPrice;
    if (tradeData.quantity !== undefined) updatedData.position_size = tradeData.quantity;
    if (tradeData.date !== undefined) updatedData.entry_date = tradeData.date;
    if (tradeData.status !== undefined) {
      updatedData.status = tradeData.status;
      
      // If closing a trade, set exit date and calculate P&L
      if (tradeData.status === 'closed' && currentTrade.status === 'open') {
        updatedData.exit_date = new Date();
        
        const exitPrice = tradeData.exitPrice || currentTrade.exitPrice;
        if (exitPrice) {
          const direction = tradeData.direction || 
            (currentTrade.direction === 'long' ? 'buy' : 'short');
          const entryPrice = tradeData.entryPrice || currentTrade.entryPrice;
          const quantity = tradeData.quantity || currentTrade.quantity;
          
          updatedData.profit_loss = calculatePnL(
            entryPrice,
            exitPrice,
            quantity,
            direction
          );
          
          updatedData.profit_loss_percentage = calculatePnLPercentage(
            entryPrice,
            exitPrice,
            direction
          );
        }
      }
    }
    if (tradeData.marketCategory !== undefined) updatedData.strategy = tradeData.marketCategory;
    if (tradeData.notes !== undefined) updatedData.notes = tradeData.notes;
    if (tradeData.tags !== undefined) updatedData.tags = tradeData.tags;
    
    // Update trade record
    const { data, error } = await supabase
      .from('trades')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating trade:", error);
      throw error;
    }
    
    return data as Trade;
  }

  // Delete a trade
  async deleteTrade(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting trade:", error);
      return false;
    }
    
    return true;
  }

  // Clear all trades for current user
  async clearAllTrades(): Promise<void> {
    const { error } = await supabase
      .from('trades')
      .delete()
      .neq('id', 'dummy'); // Delete all rows
    
    if (error) {
      console.error("Error clearing trades:", error);
      throw error;
    }
  }

  // Filter trades by criteria
  async filterTrades(filters: Partial<{
    marketCategory: string;
    symbol: string;
    direction: string;
    status: string;
    dateFrom: Date;
    dateTo: Date;
    profitOnly: boolean;
    lossOnly: boolean;
  }>): Promise<Trade[]> {
    let query = supabase
      .from('trades')
      .select('*');
    
    if (filters.marketCategory) {
      query = query.eq('strategy', filters.marketCategory);
    }
    
    if (filters.symbol) {
      query = query.ilike('symbol', `%${filters.symbol}%`);
    }
    
    // Map UI direction to DB direction
    if (filters.direction) {
      const dbDirection = filters.direction === 'buy' ? 'long' : 'short';
      query = query.eq('direction', dbDirection);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.dateFrom) {
      query = query.gte('entry_date', filters.dateFrom.toISOString());
    }
    
    if (filters.dateTo) {
      query = query.lte('entry_date', filters.dateTo.toISOString());
    }
    
    if (filters.profitOnly) {
      query = query.gt('profit_loss', 0);
    }
    
    if (filters.lossOnly) {
      query = query.lt('profit_loss', 0);
    }
    
    const { data, error } = await query.order('entry_date', { ascending: false });
    
    if (error) {
      console.error("Error filtering trades:", error);
      throw error;
    }
    
    return data as Trade[];
  }
}

export const tradeService = new TradeService();
