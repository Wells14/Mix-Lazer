import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotificationStore } from "@/stores/notificationStore";

export function NotificationSettings() {
  const { settings, updateSettings, clearAll } = useNotificationStore();

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Configurações de Notificações</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="sound">Som de Notificações</Label>
          <Switch
            id="sound"
            checked={settings.soundEnabled}
            onCheckedChange={(checked) =>
              updateSettings({ soundEnabled: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="desktop">Notificações Desktop</Label>
          <Switch
            id="desktop"
            checked={settings.desktopNotifications}
            onCheckedChange={(checked) =>
              updateSettings({ desktopNotifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="unread">Mostrar Apenas Não Lidas</Label>
          <Switch
            id="unread"
            checked={settings.showOnlyUnread}
            onCheckedChange={(checked) =>
              updateSettings({ showOnlyUnread: checked })
            }
          />
        </div>

        <div className="flex items-center gap-4">
          <Label htmlFor="max">Máximo de Notificações</Label>
          <Input
            id="max"
            type="number"
            min="1"
            max="100"
            value={settings.maxNotifications}
            onChange={(e) =>
              updateSettings({ maxNotifications: parseInt(e.target.value) || 50 })
            }
            className="w-24"
          />
        </div>

        <Button
          variant="destructive"
          onClick={clearAll}
          className="w-full mt-4"
        >
          Limpar Todas as Notificações
        </Button>
      </div>
    </Card>
  );
}
