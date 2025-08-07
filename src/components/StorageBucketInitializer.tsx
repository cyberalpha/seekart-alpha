
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const StorageBucketInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBuckets = async () => {
      try {
        // Only check if buckets exist, don't create them
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.warn("Could not check storage buckets:", error);
          return;
        }
        
        const existingBuckets = new Set(buckets.map(bucket => bucket.name));
        const requiredBuckets = ["profiles", "events"];
        const missingBuckets = requiredBuckets.filter(bucket => !existingBuckets.has(bucket));
        
        if (missingBuckets.length > 0) {
          console.warn("Missing storage buckets:", missingBuckets);
          // Note: Bucket creation should be done via database migrations for security
          // Client-side bucket creation can violate RLS policies
        } else {
          console.log("All required storage buckets exist");
        }
        
        setInitialized(true);
      } catch (err) {
        console.error("Error checking storage buckets:", err);
        // Fail silently to avoid disrupting user experience
      } finally {
        setIsChecking(false);
      }
    };

    if (!initialized && isChecking) {
      checkBuckets();
    }
  }, [initialized, isChecking]);

  // This component renders nothing, just checks bucket availability
  return null;
};

export default StorageBucketInitializer;
