
# Analytics Setup Instructions

To fix the TypeScript errors related to the new `link_analytics` table, you need to create the following database functions in Supabase:

1. Open your Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Paste and execute the following SQL:

```sql
-- Create function to insert link analytics
CREATE OR REPLACE FUNCTION public.insert_link_analytics(
  p_link_id UUID,
  p_user_id TEXT,
  p_device_type TEXT,
  p_referrer TEXT,
  p_location_country TEXT,
  p_location_city TEXT,
  p_is_qr_scan BOOLEAN
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.link_analytics (
    link_id, 
    user_id, 
    device_type, 
    referrer, 
    location_country, 
    location_city, 
    is_qr_scan
  ) VALUES (
    p_link_id,
    p_user_id,
    p_device_type,
    p_referrer,
    p_location_country,
    p_location_city,
    p_is_qr_scan
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user analytics
CREATE OR REPLACE FUNCTION public.get_user_analytics(
  p_user_id TEXT,
  p_start_date TIMESTAMP WITH TIME ZONE
) RETURNS SETOF public.link_analytics AS $$
BEGIN
  IF p_start_date IS NULL THEN
    RETURN QUERY
    SELECT * FROM public.link_analytics
    WHERE user_id = p_user_id
    ORDER BY created_at DESC;
  ELSE
    RETURN QUERY
    SELECT * FROM public.link_analytics
    WHERE user_id = p_user_id
      AND created_at >= p_start_date
    ORDER BY created_at DESC;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

5. After creating these functions, the application will use RPC calls instead of direct table access to handle analytics data.

## Explanation

The TypeScript errors were occurring because the `link_analytics` table we created wasn't included in the Supabase TypeScript definitions. Rather than modifying the type definitions (which are auto-generated), we've switched to using RPC functions that return properly typed data.

These functions:
- `insert_link_analytics`: Safely inserts data into the link_analytics table
- `get_user_analytics`: Retrieves analytics data for a specific user with optional date filtering

This approach allows us to continue using the analytics features without modifying the TypeScript definition files.
