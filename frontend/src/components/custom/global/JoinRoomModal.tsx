interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function JoinRoomModal({ isOpen, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Join Room</h2>
        <p className="mb-6">You have not joined this room yet. Do you want to join now?</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Join</button>
        </div>
      </div>
    </div>
  );
}