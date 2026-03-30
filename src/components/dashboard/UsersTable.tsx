"use client";

import { useState, useMemo, useTransition } from "react";
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  User, 
  Mail, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createUser, deleteUser, toggleUserStatus, updateUser, changeUserPassword } from "@/lib/actions/users";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  image: string | null;
}

export function UsersTable({ initialData, locale }: { initialData: UserData[]; locale: string }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isEs = locale === "es";

  // Dialog states
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Password visibility
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Change-password form
  const [pwdData, setPwdData] = useState({ password: "", confirmPassword: "" });
  const [pwdErrors, setPwdErrors] = useState<Record<string, string[]>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "RECEPTIONIST"
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const filteredData = useMemo(() => {
    return initialData.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                           user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [initialData, search, roleFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    startTransition(async () => {
      try {
        const result = await createUser(formData);
        if (result.error) {
          setErrors(result.error);
          toast({ 
            title: isEs ? "Error de validación" : "Validation error", 
            description: isEs ? "Por favor corrige los campos marcados" : "Please correct the marked fields",
            variant: "destructive" 
          });
          return;
        }
        toast({ title: isEs ? "Usuario creado" : "User created", variant: "default" });
        setIsNewUserOpen(false);
        setFormData({ name: "", email: "", password: "", role: "RECEPTIONIST" });
      } catch (error) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setErrors({});
    startTransition(async () => {
      try {
        const result = await updateUser(selectedUser.id, {
          name: formData.name,
          role: formData.role,
          isActive: selectedUser.isActive
        });
        if (result.error) {
          setErrors(result.error);
          return;
        }
        toast({ title: isEs ? "Usuario actualizado" : "User updated" });
        setIsEditOpen(false);
      } catch (error) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    startTransition(async () => {
      try {
        await deleteUser(selectedUser.id);
        toast({ title: isEs ? "Usuario eliminado" : "User deleted" });
        setIsDeleteOpen(false);
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setPwdErrors({});

    // Client-side quick match check
    if (pwdData.password !== pwdData.confirmPassword) {
      setPwdErrors({ confirmPassword: [isEs ? "Las contraseñas no coinciden" : "Passwords do not match"] });
      return;
    }

    startTransition(async () => {
      try {
        const result = await changeUserPassword(selectedUser.id, pwdData);
        if (result?.error) {
          setPwdErrors(result.error as Record<string, string[]>);
          return;
        }
        toast({
          title: isEs ? "Contraseña actualizada" : "Password updated",
          description: isEs
            ? `La contraseña de ${selectedUser.name} fue cambiada exitosamente.`
            : `${selectedUser.name}'s password was changed successfully.`,
        });
        setIsChangePasswordOpen(false);
        setPwdData({ password: "", confirmPassword: "" });
      } catch {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const handleToggleStatus = (user: UserData) => {
    startTransition(async () => {
      try {
        await toggleUserStatus(user.id, !user.isActive);
        toast({ 
          title: isEs ? "Estado actualizado" : "Status updated",
          description: user.isActive 
            ? (isEs ? "Usuario desactivado" : "User deactivated")
            : (isEs ? "Usuario activado" : "User activated")
        });
      } catch (error) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none">
        <div className="flex flex-1 gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input 
              placeholder={isEs ? "Buscar usuario..." : "Search user..."}
              className="pl-10 h-11 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px] h-11 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 font-bold text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
              <SelectValue placeholder={isEs ? "Rol" : "Role"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none">
              <SelectItem value="ALL" className="text-xs font-bold uppercase">{isEs ? "Todos" : "All"}</SelectItem>
              <SelectItem value="ADMIN" className="text-xs font-bold uppercase italic text-brand-blue">ADMIN</SelectItem>
              <SelectItem value="OWNER" className="text-xs font-bold uppercase italic text-brand-green">OWNER</SelectItem>
              <SelectItem value="RECEPTIONIST" className="text-xs font-bold uppercase">{isEs ? "RECEPCIONISTA" : "RECEPTIONIST"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => {
            setFormData({ name: "", email: "", password: "", role: "RECEPTIONIST" });
            setIsNewUserOpen(true);
          }}
          className="h-11 rounded-xl bg-gray-900 hover:bg-black text-white px-6 font-bold gap-2 shadow-lg dark:shadow-none shadow-gray-200 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          {isEs ? "Nuevo Usuario" : "New User"}
        </Button>
      </div>

      {/* Table Content */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/30">
              <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isEs ? "Usuario" : "User"}</th>
              <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isEs ? "Rol" : "Role"}</th>
              <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isEs ? "Estado" : "Status"}</th>
              <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">{isEs ? "Acciones" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {filteredData.map((user) => (
              <tr key={user.id} className="hover:bg-brand-blue/5 dark:hover:bg-slate-800/70 transition-colors group">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold overflow-hidden">
                      {user.image ? (
                        <img src={user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">{user.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg inline-block border",
                    user.role === 'ADMIN' ? "bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue border-brand-blue/20" :
                    user.role === 'OWNER' ? "bg-brand-green/10 dark:bg-brand-green/20 text-brand-green border-brand-green/20" :
                    "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700"
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <button 
                    onClick={() => handleToggleStatus(user)}
                    disabled={isPending}
                    className={cn(
                      "flex items-center gap-1.5 text-[10px] font-bold uppercase transition-all",
                      user.isActive ? "text-green-600 hover:text-green-700" : "text-gray-300 dark:text-gray-600 hover:text-gray-400"
                    )}
                  >
                    {user.isActive ? (
                      <><CheckCircle2 className="w-3.5 h-3.5" />{isEs ? "Activo" : "Active"}</>
                    ) : (
                      <><XCircle className="w-3.5 h-3.5" />{isEs ? "Inactivo" : "Inactive"}</>
                    )}
                  </button>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-slate-800 shadow-none border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                        <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-brand-blue transition-colors" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none p-1.5 w-52">
                      <DropdownMenuItem 
                        className="rounded-xl text-xs font-bold gap-2 cursor-pointer focus:bg-gray-50 dark:focus:bg-slate-800"
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData({ name: user.name, email: user.email, password: "", role: user.role });
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        {isEs ? "Editar Perfil" : "Edit Profile"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="rounded-xl text-xs font-bold gap-2 cursor-pointer focus:bg-gray-50 dark:focus:bg-slate-800"
                        onClick={() => {
                          setSelectedUser(user);
                          setPwdData({ password: "", confirmPassword: "" });
                          setPwdErrors({});
                          setShowNewPwd(false);
                          setShowConfirmPwd(false);
                          setIsChangePasswordOpen(true);
                        }}
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        {isEs ? "Cambiar Contraseña" : "Change Password"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1.5 border-gray-100 dark:border-slate-800" />
                      <DropdownMenuItem 
                        className="rounded-xl text-xs font-bold gap-2 cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {isEs ? "Eliminar Cuenta" : "Delete Account"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="py-20 text-center">
            <User className="w-12 h-12 text-gray-100 mx-auto mb-4" />
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
              {isEs ? "No se encontraron usuarios." : "No users found."}
            </p>
          </div>
        )}
      </div>

      {/* New User Dialog */}
      <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
        <DialogContent className="rounded-[2.5rem] border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none p-8 sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
              {isEs ? "Crear Nuevo Usuario" : "Create New User"}
            </DialogTitle>
            <DialogDescription className="text-gray-400 dark:text-gray-500 font-medium pt-1">
              {isEs ? "Registra un nuevo miembro del staff." : "Register a new staff member."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-5 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                  {isEs ? "Nombre Completo" : "Full Name"}
                </label>
                <Input 
                  placeholder="Ej. John Doe" 
                  className={cn(
                    "h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all text-sm font-bold shadow-none",
                    errors.name && "border-red-500 bg-red-50 focus:bg-red-50"
                  )}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                {errors.name && (
                  <p className="text-[10px] text-red-500 font-bold px-1 mt-1">
                    {errors.name[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                  {isEs ? "Correo Electrónico" : "Email Address"}
                </label>
                <div className="relative">
                  <Mail className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                    errors.email ? "text-red-400" : "text-gray-300 dark:text-gray-600"
                  )} />
                  <Input 
                    type="email"
                    placeholder="john@example.com" 
                    className={cn(
                      "pl-12 h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all text-sm font-bold shadow-none",
                      errors.email && "border-red-500 bg-red-50 focus:bg-red-50"
                    )}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-500 font-bold px-1 mt-1">
                    {errors.email[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                    {isEs ? "Contraseña" : "Password"}
                  </label>
                  <Input 
                    type="password"
                    className={cn(
                      "h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all text-sm font-bold shadow-none",
                      errors.password && "border-red-500 bg-red-50 focus:bg-red-50"
                    )}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  {errors.password && (
                    <p className="text-[10px] text-red-500 font-bold px-1 mt-1 line-clamp-1">
                      {errors.password[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                    {isEs ? "Rol del Sistema" : "System Role"}
                  </label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(val) => setFormData({...formData, role: val})}
                  >
                    <SelectTrigger className={cn(
                      "h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400 shadow-none",
                      errors.role && "border-red-500 bg-red-50"
                    )}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none">
                      <SelectItem value="ADMIN" className="text-xs font-bold uppercase italic text-brand-blue">ADMIN</SelectItem>
                      <SelectItem value="OWNER" className="text-xs font-bold uppercase italic text-brand-green">OWNER</SelectItem>
                      <SelectItem value="RECEPTIONIST" className="text-xs font-bold uppercase">RECEPCIONISTA</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-[10px] text-red-500 font-bold px-1 mt-1">
                      {errors.role[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full h-12 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-xl dark:shadow-none shadow-gray-200 transition-all active:scale-95"
              >
                {isEs ? "Registrar Usuario" : "Register User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-[2.5rem] border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none p-8 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
              {isEs ? "Editar Usuario" : "Edit User"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdate} className="space-y-5 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                {isEs ? "Nombre Completo" : "Full Name"}
              </label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={cn(
                  "h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all text-sm font-bold shadow-none",
                  errors.name && "border-red-500 bg-red-50 focus:bg-red-50"
                )}
              />
              {errors.name && (
                <p className="text-[10px] text-red-500 font-bold px-1 mt-1">
                  {errors.name[0]}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                {isEs ? "Rol del Sistema" : "System Role"}
              </label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({...formData, role: val})}
              >
                <SelectTrigger className={cn(
                  "h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 font-bold text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400 shadow-none",
                  errors.role && "border-red-500 bg-red-50"
                )}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none">
                  <SelectItem value="ADMIN" className="text-xs font-bold uppercase italic text-brand-blue">ADMIN</SelectItem>
                  <SelectItem value="OWNER" className="text-xs font-bold uppercase italic text-brand-green">OWNER</SelectItem>
                  <SelectItem value="RECEPTIONIST" className="text-xs font-bold uppercase">RECEPCIONISTA</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-[10px] text-red-500 font-bold px-1 mt-1">
                  {errors.role[0]}
                </p>
              )}
            </div>

            <DialogFooter className="pt-6">
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full h-12 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-xl dark:shadow-none shadow-gray-200 transition-all active:scale-95"
              >
                {isEs ? "Guardar Cambios" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="rounded-[2.5rem] border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none p-8 sm:max-w-[420px]">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 dark:text-amber-400 mb-2 mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
              {isEs ? "Cambiar Contraseña" : "Change Password"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400 dark:text-gray-500 font-medium pt-1">
              {isEs
                ? `Asigna una nueva contraseña para ${selectedUser?.name ?? "este usuario"}.`
                : `Set a new password for ${selectedUser?.name ?? "this user"}.`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-5 pt-4">
            {/* New password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                {isEs ? "Nueva Contraseña" : "New Password"}
              </label>
              <div className="relative">
                <Input
                  type={showNewPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={pwdData.password}
                  onChange={(e) => setPwdData({ ...pwdData, password: e.target.value })}
                  className={cn(
                    "h-12 pr-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all text-sm font-bold shadow-none",
                    pwdErrors.password && "border-red-500 bg-red-50 focus:bg-red-50"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                >
                  {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwdErrors.password && (
                <p className="text-[10px] text-red-500 font-bold px-1 mt-1">{pwdErrors.password[0]}</p>
              )}
              <p className="text-[10px] text-gray-400 dark:text-gray-500 px-1">
                {isEs
                  ? "Mín. 8 caracteres · mayúscula · minúscula · número"
                  : "Min. 8 chars · uppercase · lowercase · number"}
              </p>
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
                {isEs ? "Confirmar Contraseña" : "Confirm Password"}
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={pwdData.confirmPassword}
                  onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                  className={cn(
                    "h-12 pr-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all text-sm font-bold shadow-none",
                    pwdErrors.confirmPassword && "border-red-500 bg-red-50 focus:bg-red-50"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                >
                  {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwdErrors.confirmPassword && (
                <p className="text-[10px] text-red-500 font-bold px-1 mt-1">{pwdErrors.confirmPassword[0]}</p>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsChangePasswordOpen(false)}
                className="flex-1 h-12 rounded-2xl border-gray-100 dark:border-slate-800 font-bold text-sm"
              >
                {isEs ? "Cancelar" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 h-12 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-xl dark:shadow-none shadow-gray-200 transition-all active:scale-95"
              >
                {isEs ? "Guardar" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-[2.5rem] border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none p-8 sm:max-w-[400px]">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
              {isEs ? "¿Confirmar Eliminación?" : "Confirm Deletion?"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400 dark:text-gray-500 font-medium pt-1">
              {isEs 
                ? "Esta acción es irreversible. Se eliminarán permanentemente los datos del usuario." 
                : "This action is irreversible. User data will be permanently deleted."}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex gap-3 sm:gap-0 sm:flex-row mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 h-12 rounded-2xl border-gray-100 dark:border-slate-800 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800/50 uppercase tracking-widest"
            >
              {isEs ? "Cancelar" : "Cancel"}
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-xl dark:shadow-none shadow-red-100 uppercase tracking-widest active:scale-95"
            >
              {isEs ? "Eliminar" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
