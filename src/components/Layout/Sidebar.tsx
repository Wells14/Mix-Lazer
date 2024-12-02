import {
  BoxIcon,
  FolderIcon,
  TruckIcon,
  SettingsIcon,
  MessageSquare,
  Users,
  ChevronLeftIcon,
  ChevronRightIcon,
  PrinterIcon,
  MonitorIcon,
  PaletteIcon,
  Mail,
  FileText,
  CreditCard,
  ShoppingCart,
  Percent,
  FileSignature,
  Package,
  DollarSign,
  Boxes,
  Database,
  ClipboardList,
  Calculator,
  ShoppingBag,
  Factory,
  ListTodo,
  Receipt,
  Building2,
  Wallet,
  BanknoteIcon,
  BarChart3,
  PiggyBank,
  Cog,
  Paintbrush,
  Shapes,
  ScissorsIcon,
  LayoutTemplateIcon,
  PaperclipIcon,
  ChevronDown as ChevronDownIcon,
  Package as PackageIcon,
  File as FileIcon,
  Menu
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useResponsive } from '@/hooks/useResponsive';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isMobile } = useResponsive();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const vendasItems = [
    { icon: <ClipboardList size={16} />, label: "Pedidos", path: "/vendas/pedidos" },
    { icon: <Calculator size={16} />, label: "Orçamentos", path: "/vendas/orcamentos" },
    { icon: <ShoppingBag size={16} />, label: "Produto Simples", path: "/vendas/produto-simples" },
    { icon: <Factory size={16} />, label: "PCP", path: "/vendas/pcp" },
    { icon: <ShoppingCart size={16} />, label: "PDV", path: "/vendas/pdv" },
    { icon: <ListTodo size={16} />, label: "Tarefas", path: "/vendas/tarefas" },
  ];

  const financeiroItems = [
    { icon: <Receipt size={16} />, label: "Transações", path: "/financeiro/transacoes" },
    { icon: <FileText size={16} />, label: "Nota Fiscal", path: "/financeiro/nota-fiscal" },
    { icon: <FileText size={16} />, label: "Multi Faturamento", path: "/financeiro/multi-faturamento" },
    { icon: <BanknoteIcon size={16} />, label: "Boleto Bancário", path: "/financeiro/boleto" },
    { icon: <Building2 size={16} />, label: "Contas Bancárias", path: "/financeiro/contas" },
    { icon: <Wallet size={16} />, label: "Categorias", path: "/financeiro/categorias" },
    { icon: <BarChart3 size={16} />, label: "Categorias DRE", path: "/financeiro/categorias-dre" },
    { icon: <PiggyBank size={16} />, label: "Caixas PDV", path: "/financeiro/caixas-pdv" },
    { icon: <Percent size={16} />, label: "Comissões", path: "/financeiro/comissoes" },
    { icon: <BarChart3 size={16} />, label: "Centros de Custos", path: "/financeiro/centros-custos" },
  ];

  const offsetItems = [
    { icon: <Cog size={16} />, label: "Máquinas", path: "/offset/maquinas" },
    { icon: <Paintbrush size={16} />, label: "Acabamentos", path: "/offset/acabamentos" },
    { icon: <FileText size={16} />, label: "Papéis", path: "/offset/papeis" },
    { icon: <Shapes size={16} />, label: "Modelos", path: "/offset/modelos" },
  ];

  const menuItems = [
    { icon: <Boxes size={20} />, label: "Estoque", path: "/estoque" },
    { icon: <Database size={20} />, label: "Cadastros Gerais", path: "/cadastros" },
    { icon: <BoxIcon size={20} />, label: "Produtos", path: "/products" },
    { icon: <Users size={20} />, label: "Clientes", path: "/customers" },
    { icon: <TruckIcon size={20} />, label: "Produção", path: "/producao" },
    { icon: <MessageSquare size={20} />, label: "WhatsApp", path: "/whatsapp" },
    { icon: <MonitorIcon size={20} />, label: "Digital", path: "/digital" },
    { icon: <PaletteIcon size={20} />, label: "Comunicação Visual", path: "/comunicacao-visual" },
  ];

  const configItems = [
    { icon: <SettingsIcon size={16} />, label: "Geral", path: "/config/geral" },
    { icon: <Mail size={16} />, label: "E-mail SMTP", path: "/config/email" },
    { icon: <FileText size={16} />, label: "Offset", path: "/config/offset" },
    { icon: <FileText size={16} />, label: "CV e Digital", path: "/config/cv-digital" },
    { icon: <CreditCard size={16} />, label: "Certificado Digital", path: "/config/certificado" },
    { icon: <FileText size={16} />, label: "Config. NF-e", path: "/config/nfe" },
    { icon: <FileText size={16} />, label: "Config. NFC-e", path: "/config/nfce" },
    { icon: <FileText size={16} />, label: "Config. NFS-e", path: "/config/nfse" },
    { icon: <CreditCard size={16} />, label: "Config. Boleto", path: "/config/boleto" },
    { icon: <ShoppingCart size={16} />, label: "Config. Compras", path: "/config/compras" },
    { icon: <Percent size={16} />, label: "Config. Comissões", path: "/config/comissoes" },
    { icon: <FileSignature size={16} />, label: "Config. Assinatura", path: "/config/assinatura" },
    { icon: <Package size={16} />, label: "Config. Materiais", path: "/config/materiais" },
  ];

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
        >
          <Menu size={24} />
        </button>
      )}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobile ? (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          transition-all duration-300 ease-in-out
          bg-white border-r border-gray-200
          flex flex-col
          ${isMobile ? 'shadow-lg' : ''}
        `}
      >
        <div className="flex items-center justify-between p-4">
          <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
            <h1 className="text-xl font-bold">Dashboardly</h1>
          </div>
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {isCollapsed ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={20} />}
            </button>
          )}
        </div>

        <nav className="pb-20">
          {/* Menu Offset */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center w-full p-2 rounded-lg transition-colors hover:bg-primary-hover group",
                  location.pathname.startsWith("/offset") && "bg-primary-hover"
                )}
              >
                <PrinterIcon className="w-5 h-5 text-white" />
                <span
                  className={cn(
                    "ml-3 text-white",
                    isCollapsed ? "hidden group-hover:block" : "block"
                  )}
                >
                  Offset
                </span>
                <ChevronDownIcon
                  className={cn(
                    "w-4 h-4 ml-auto text-white transition-transform",
                    isCollapsed ? "hidden group-hover:block" : "block"
                  )}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#002359] text-white border-none">
              <Link to="/offset/insumos">
                <DropdownMenuItem className="hover:bg-primary-hover cursor-pointer">
                  <PackageIcon className="w-4 h-4 mr-2" />
                  Insumos
                </DropdownMenuItem>
              </Link>
              <Link to="/offset/maquinas">
                <DropdownMenuItem className="hover:bg-primary-hover cursor-pointer">
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Máquinas
                </DropdownMenuItem>
              </Link>
              <Link to="/offset/acabamentos">
                <DropdownMenuItem className="hover:bg-primary-hover cursor-pointer">
                  <ScissorsIcon className="w-4 h-4 mr-2" />
                  Acabamentos
                </DropdownMenuItem>
              </Link>
              <Link to="/offset/papeis">
                <DropdownMenuItem className="hover:bg-primary-hover cursor-pointer">
                  <FileIcon className="w-4 h-4 mr-2" />
                  Papéis
                </DropdownMenuItem>
              </Link>
              <Link to="/offset/modelos">
                <DropdownMenuItem className="hover:bg-primary-hover cursor-pointer">
                  <LayoutTemplateIcon className="w-4 h-4 mr-2" />
                  Modelos
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-primary-hover rounded-lg transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <DollarSign size={20} />
                <span className={cn("transition-opacity duration-300",
                  isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                )}>
                  Financeiro
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 ml-2 bg-white" 
              side={isCollapsed ? "right" : "right"}
              align="start"
              onClick={(e) => e.stopPropagation()}
            >
              {financeiroItems.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link 
                    to={item.path}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-primary-hover rounded-lg transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <ShoppingCart size={20} />
                <span className={cn("transition-opacity duration-300",
                  isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                )}>
                  Vendas
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 ml-2 bg-white" 
              side={isCollapsed ? "right" : "right"}
              align="start"
              onClick={(e) => e.stopPropagation()}
            >
              {vendasItems.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link 
                    to={item.path}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-primary-hover rounded-lg transition-all duration-200"
              title={isCollapsed ? item.label : ""}
            >
              {item.icon}
              <span className={cn("transition-opacity duration-300", 
                isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              )}>
                {item.label}
              </span>
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-primary-hover rounded-lg transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <SettingsIcon size={20} />
                <span className={cn("transition-opacity duration-300",
                  isCollapsed ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                )}>
                  Configurações
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 ml-2 bg-white" 
              side={isCollapsed ? "right" : "right"}
              align="start"
              onClick={(e) => e.stopPropagation()}
            >
              {configItems.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link 
                    to={item.path}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;