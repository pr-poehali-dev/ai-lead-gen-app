import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface SocialAccount {
  platform: 'whatsapp' | 'telegram' | 'vk' | 'email';
  connected: boolean;
  account?: string;
}

const SocialConnect = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { platform: 'whatsapp', connected: false },
    { platform: 'telegram', connected: false },
    { platform: 'vk', connected: false },
    { platform: 'email', connected: false },
  ]);

  const [editMode, setEditMode] = useState<string | null>(null);
  const [accountInput, setAccountInput] = useState('');

  const platformConfig = {
    whatsapp: {
      name: 'WhatsApp',
      icon: 'MessageCircle',
      color: 'bg-green-500',
      placeholder: '+7 (999) 123-45-67'
    },
    telegram: {
      name: 'Telegram',
      icon: 'Send',
      color: 'bg-blue-500',
      placeholder: '@username или +7 (999) 123-45-67'
    },
    vk: {
      name: 'ВКонтакте',
      icon: 'Users',
      color: 'bg-blue-600',
      placeholder: 'vk.com/username'
    },
    email: {
      name: 'Email',
      icon: 'Mail',
      color: 'bg-purple-500',
      placeholder: 'example@company.com'
    }
  };

  const handleConnect = (platform: string) => {
    if (accountInput.trim()) {
      setAccounts(accounts.map(acc => 
        acc.platform === platform 
          ? { ...acc, connected: true, account: accountInput }
          : acc
      ));
      setEditMode(null);
      setAccountInput('');
    }
  };

  const handleDisconnect = (platform: string) => {
    setAccounts(accounts.map(acc => 
      acc.platform === platform 
        ? { ...acc, connected: false, account: undefined }
        : acc
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Link" size={24} />
          Подключенные соцсети
        </CardTitle>
        <CardDescription>Привяжите аккаунты для отправки сообщений лидам</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => {
            const config = platformConfig[account.platform];
            return (
              <div 
                key={account.platform} 
                className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`${config.color} p-2 rounded-lg text-white`}>
                      <Icon name={config.icon as any} size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{config.name}</h3>
                      {account.connected && account.account && (
                        <p className="text-sm text-muted-foreground">{account.account}</p>
                      )}
                    </div>
                  </div>
                  {account.connected ? (
                    <Badge className="bg-green-500">Подключен</Badge>
                  ) : (
                    <Badge variant="outline">Не подключен</Badge>
                  )}
                </div>

                {editMode === account.platform ? (
                  <div className="space-y-2">
                    <Input
                      placeholder={config.placeholder}
                      value={accountInput}
                      onChange={(e) => setAccountInput(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleConnect(account.platform)}
                        className="flex-1"
                      >
                        Подключить
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditMode(null);
                          setAccountInput('');
                        }}
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {account.connected ? (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditMode(account.platform);
                            setAccountInput(account.account || '');
                          }}
                          className="flex-1"
                        >
                          <Icon name="Edit" size={16} className="mr-2" />
                          Изменить
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDisconnect(account.platform)}
                        >
                          <Icon name="Unlink" size={16} />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditMode(account.platform)}
                        className="w-full"
                      >
                        <Icon name="Plus" size={16} className="mr-2" />
                        Подключить
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialConnect;
