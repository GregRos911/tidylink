
import { supabase } from '@/integrations/supabase/client';
import { LinkItem } from '../types/linkTypes';

// Check if an alias is already in use in Supabase
export const isAliasInUseInSupabase = async (alias: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('links')
      .select('id')
      .eq('custom_backhalf', alias)
      .maybeSingle();
    
    return !!data;
  } catch (error) {
    console.error('Error checking alias in Supabase:', error);
    return false;
  }
};

// Get a link by its ID from Supabase
export const getLinkFromSupabase = async (id: string): Promise<LinkItem | null> => {
  try {
    const { data } = await supabase
      .from('links')
      .select('*')
      .or(`short_url.ilike.%/r/${id},custom_backhalf.eq.${id}`)
      .maybeSingle();
    
    if (data) {
      return {
        id: data.id,
        originalUrl: data.original_url,
        shortUrl: data.short_url,
        createdAt: data.created_at,
        clicks: data.clicks || 0,
        isQrCodeGenerated: data.is_qr_code_generated || false
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting link from Supabase:', error);
    return null;
  }
};

// Increment click count for a link in Supabase
export const incrementClickCountInSupabase = async (id: string): Promise<void> => {
  try {
    const { data } = await supabase
      .from('links')
      .select('id, clicks')
      .or(`short_url.ilike.%/r/${id},custom_backhalf.eq.${id}`)
      .maybeSingle();
    
    if (data) {
      await supabase
        .from('links')
        .update({ clicks: (data.clicks || 0) + 1 })
        .eq('id', data.id);
    }
  } catch (error) {
    console.error('Error incrementing click count in Supabase:', error);
  }
};

// Get all links from Supabase
export const getLinksFromSupabase = async (): Promise<LinkItem[]> => {
  try {
    const { data } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        originalUrl: item.original_url,
        shortUrl: item.short_url,
        createdAt: item.created_at,
        clicks: item.clicks || 0,
        isQrCodeGenerated: item.is_qr_code_generated || false
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting links from Supabase:', error);
    return [];
  }
};

// Delete a link from Supabase
export const deleteLinkFromSupabase = async (id: string): Promise<void> => {
  try {
    await supabase
      .from('links')
      .delete()
      .eq('id', id);
  } catch (error) {
    console.error('Error deleting link from Supabase:', error);
  }
};
