// import { useEffect, useState } from "react";
// import {
//   getUsersApi,
//   updateRoleApi,
//   toggleBlockApi,
// } from "../../services/admin.user.api";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import toast from "react-hot-toast";

// type User = {
//   _id: string;
//   name: string;
//   email: string;
//   role: "USER" | "ADMIN";
//   isBlocked: boolean;
// };

// const Users = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [open, setOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [newRole, setNewRole] = useState<User["role"]>("USER");

//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [page, setPage] = useState(1);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const load = async () => {
//     try {
//       const data = await getUsersApi(debouncedSearch, page);
//       setUsers(data?.data || data || []);
//     } catch {
//       toast.error("Failed to load users ❌");
//     }
//   };

//   useEffect(() => {
//     load();
//   }, [debouncedSearch, page]);

//   const openRoleModal = (user: User) => {
//     setSelectedUser(user);
//     setNewRole(user.role);
//     setOpen(true);
//   };

//   const handleUpdateRole = async () => {
//     if (!selectedUser) return;

//     try {
//       await updateRoleApi(selectedUser._id, newRole);
//       toast.success("Role updated ✅");
//       setOpen(false);
//       load();
//     } catch {
//       toast.error("Failed ❌");
//     }
//   };

//   const handleToggleBlock = async (id: string) => {
//     try {
//       await toggleBlockApi(id);
//       toast.success("Status updated ✅");
//       load();
//     } catch {
//       toast.error("Failed ❌");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row justify-between gap-3">
//         <h2 className="text-2xl font-bold">Users Management</h2>

//         <input
//           type="text"
//           placeholder="Search users..."
//           className="border px-3 py-2 rounded-lg w-full md:w-1/3"
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//         />
//       </div>

//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100 text-gray-600">
//             <tr>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Email</th>
//               <th className="p-3 text-left">Role</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="text-center p-5 text-gray-500">
//                   No users found 😴
//                 </td>
//               </tr>
//             ) : (
//               users.map((u) => (
//                 <tr key={u._id} className="border-t hover:bg-gray-50">
//                   <td className="p-3 font-medium">{u.name}</td>
//                   <td className="p-3 text-gray-500">{u.email}</td>

//                   <td className="p-3">
//                     <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
//                       {u.role}
//                     </span>
//                   </td>

//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 text-xs rounded ${
//                         u.isBlocked
//                           ? "bg-red-100 text-red-600"
//                           : "bg-green-100 text-green-600"
//                       }`}
//                     >
//                       {u.isBlocked ? "Blocked" : "Active"}
//                     </span>
//                   </td>

//                   <td className="p-3 flex gap-2">
//                     <button
//                       onClick={() => openRoleModal(u)}
//                       className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
//                     >
//                       Change Role
//                     </button>

//                     <button
//                       onClick={() => handleToggleBlock(u._id)}
//                       className={`px-3 py-1 rounded text-xs ${
//                         u.isBlocked
//                           ? "bg-green-500 text-white"
//                           : "bg-red-500 text-white"
//                       }`}
//                     >
//                       {u.isBlocked ? "Unblock" : "Block"}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Dialog open={open} onClose={() => setOpen(false)}>
//         <DialogTitle>Change User Role</DialogTitle>
//         <DialogContent>
//           <Select
//             fullWidth
//             value={newRole}
//             onChange={(e) => setNewRole(e.target.value as User["role"])}
//           >
//             <MenuItem value="USER">USER</MenuItem>
//             <MenuItem value="ADMIN">ADMIN</MenuItem>
//           </Select>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setOpen(false)}>Cancel</Button>
//           <Button onClick={handleUpdateRole} variant="contained">
//             Update
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default Users;


import { useEffect, useState } from "react";
import {
  getUsersApi,
  updateRoleApi,
  toggleBlockApi,
} from "../../services/admin.user.api";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

import {
  Search,
  Person,
  AdminPanelSettings,
  Block,
  CheckCircle,
} from "@mui/icons-material";

import toast from "react-hot-toast";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<User["role"]>("USER");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // 🔥 debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getUsersApi(debouncedSearch, page);
      setUsers(data?.data || data || []);
    } catch {
      toast.error("Failed to load users ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [debouncedSearch, page]);

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      await updateRoleApi(selectedUser._id, newRole);
      toast.success("Role updated ✅");
      setOpen(false);
      load();
    } catch {
      toast.error("Failed ❌");
    }
  };

  const handleToggleBlock = async (id: string) => {
    try {
      await toggleBlockApi(id);
      toast.success("Status updated ✅");
      load();
    } catch {
      toast.error("Failed ❌");
    }
  };

  return (
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Person /> Users Management
        </h2>

        {/* SEARCH */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
            placeholder="Search users..."
            className="w-full border pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* 🔥 TABLE CARD */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        {/* LOADING */}
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading users...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-400">
                    No users found 😕
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* USER */}
                    <td className="p-4 font-medium flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                        {u.name?.[0]}
                      </div>
                      {u.name}
                    </td>

                    {/* EMAIL */}
                    <td className="p-4 text-gray-500">{u.email}</td>

                    {/* ROLE */}
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1 w-fit">
                        <AdminPanelSettings fontSize="inherit" />
                        {u.role}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${
                          u.isBlocked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {u.isBlocked ? <Block fontSize="inherit" /> : <CheckCircle fontSize="inherit" />}
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => openRoleModal(u)}
                        className="px-3 py-1 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
                      >
                        Change Role
                      </button>

                      <button
                        onClick={() => handleToggleBlock(u._id)}
                        className={`px-3 py-1 text-xs rounded-lg transition ${
                          u.isBlocked
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔥 MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle className="font-semibold">
          Change User Role
        </DialogTitle>

        <DialogContent className="pt-4">
          <Select
            fullWidth
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as User["role"])}
          >
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;