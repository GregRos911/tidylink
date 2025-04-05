
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
