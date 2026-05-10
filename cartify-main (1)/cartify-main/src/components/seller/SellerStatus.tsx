interface SellerRequest {
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

interface Props {
  request: SellerRequest;
  onRetry: () => void;
}

const SellerStatus = ({ request, onRetry }: Props) => {
  const status = request.status;

  return (
    <div className="max-w-[600px] mx-auto bg-white p-6 rounded-xl shadow text-center">
      {status === "PENDING" && (
        <>
          <h2 className="text-xl font-bold text-yellow-600">
            ⏳ Request Pending
          </h2>
          <p className="mt-2 text-gray-600">
            Admin is reviewing your request
          </p>
        </>
      )}

      {status === "APPROVED" && (
        <>
          <h2 className="text-xl font-bold text-green-600">
            ✅ Approved
          </h2>
          <p className="mt-2 text-gray-600">
            You are now a seller 🎉
          </p>
        </>
      )}

      {status === "REJECTED" && (
        <>
          <h2 className="text-xl font-bold text-red-600">
            ❌ Rejected
          </h2>

          <p className="text-gray-600 mt-2">
            {request.rejectionReason ?? "Try again"}
          </p>

          <button
            onClick={onRetry}
            className="mt-4 bg-primary text-white px-4 py-2 rounded"
          >
            Apply Again
          </button>
        </>
      )}
    </div>
  );
};

export default SellerStatus;