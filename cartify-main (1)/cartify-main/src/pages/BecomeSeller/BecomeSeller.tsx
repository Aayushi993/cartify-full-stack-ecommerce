import { useEffect, useState, useCallback } from "react";
import { getSellerStatusApi } from "../../services/seller.api";
import { AppLoader } from "../../components/ui/AppLoader/AppLoader";
import SellerForm from "../../components/seller/SellerForm";
import SellerStatus from "../../components/seller/SellerStatus";

interface SellerRequest {
  _id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

const BecomeSeller = () => {
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<SellerRequest | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadStatus = useCallback(async () => {
    let isMounted = true;

    try {
      const data = await getSellerStatusApi();

      if (isMounted) {
        setRequest(data ?? null);
      }
    } catch {
      if (isMounted) setRequest(null);
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // 🔥 retry → force fresh form
  const handleRetry = () => {
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setLoading(true); // 🔥 ensures loader shows again
    loadStatus();
  };

  if (loading) return <AppLoader />;

  return (
    <div className="py-10">
      {showForm ? (
        <SellerForm onSuccess={handleSuccess} request={request} />
      ) : !request ? (
        <SellerForm onSuccess={handleSuccess} />
      ) : (
        <SellerStatus request={request} onRetry={handleRetry} />
      )}
    </div>
  );
};

export default BecomeSeller;