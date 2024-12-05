import { useEffect } from 'react';
import { analyticsConfig } from '@/config/analytics';
import { useNotificationStore } from '@/stores/notificationStore';

export function NotificationSystem() {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!window.Pusher || !window.Swal) {
      console.error('Pusher ou SweetAlert2 não estão carregados');
      return;
    }

    try {
      const pusher = new window.Pusher(analyticsConfig.pusher.key, {
        cluster: analyticsConfig.pusher.cluster,
        encrypted: true
      });

      // Canal para notificações gerais
      const notificationChannel = pusher.subscribe('notifications');
      
      // Ouve por novas notificações
      notificationChannel.bind('new-notification', (data: any) => {
        addNotification({
          title: data.title || 'Nova Notificação',
          message: data.message,
          type: data.type || 'info',
          category: data.category,
          priority: data.priority,
          actions: data.actions
        });

        window.Swal.fire({
          title: data.title || 'Nova Notificação',
          text: data.message,
          icon: data.type || 'info',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      });

      // Canal para pedidos
      const ordersChannel = pusher.subscribe('orders');
      
      // Ouve por novos pedidos
      ordersChannel.bind('new-order', (data: any) => {
        addNotification({
          title: 'Novo Pedido!',
          message: `Cliente: ${data.customerName}\nValor: R$ ${data.total.toFixed(2)}`,
          type: 'success',
          category: 'orders',
          priority: 'high',
          actions: [
            {
              label: 'Ver Detalhes',
              action: `view-order:${data.orderId}`
            },
            {
              label: 'Processar Pedido',
              action: `process-order:${data.orderId}`
            }
          ]
        });

        window.Swal.fire({
          title: 'Novo Pedido!',
          html: `
            <p><strong>Cliente:</strong> ${data.customerName}</p>
            <p><strong>Valor:</strong> R$ ${data.total.toFixed(2)}</p>
          `,
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: 'Ver Detalhes'
        }).then((result) => {
          if (result.isConfirmed && data.orderId) {
            // Navega para a página do pedido
            window.location.href = `/orders/${data.orderId}`;
          }
        });
      });

      // Ouve por atualizações de status
      ordersChannel.bind('status-update', (data: any) => {
        window.Swal.fire({
          title: 'Status Atualizado',
          text: `Pedido #${data.orderId}: ${data.status}`,
          icon: 'info',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      });

      // Canal para alertas do sistema
      const systemChannel = pusher.subscribe('system');
      
      // Ouve por alertas do sistema
      systemChannel.bind('system-alert', (data: any) => {
        addNotification({
          title: 'Alerta do Sistema',
          message: data.message,
          type: 'warning',
          category: 'system',
          priority: data.priority || 'medium'
        });
      });

      // Canal para atualizações
      const updatesChannel = pusher.subscribe('updates');
      
      // Ouve por novas atualizações
      updatesChannel.bind('new-update', (data: any) => {
        addNotification({
          title: 'Nova Atualização',
          message: data.message,
          type: 'info',
          category: 'updates',
          priority: 'low',
          actions: [
            {
              label: 'Ver Novidades',
              action: 'view-updates'
            }
          ]
        });
      });

      return () => {
        pusher.unsubscribe('notifications');
        pusher.unsubscribe('orders');
        pusher.unsubscribe('system');
        pusher.unsubscribe('updates');
      };
    } catch (error) {
      console.error('Erro ao configurar Pusher:', error);
    }
  }, [addNotification]);

  return null;
}
