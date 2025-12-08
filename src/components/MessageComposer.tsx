import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface MessageComposerProps {
  leadsCount: number;
  onSend: (message: string, platform: string) => void;
}

const MessageComposer = ({ leadsCount, onSend }: MessageComposerProps) => {
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState('whatsapp');
  const [isSending, setIsSending] = useState(false);

  const templates = [
    {
      name: 'Приветствие',
      text: 'Здравствуйте! Меня зовут {ваше_имя} из компании {компания}. Мы специализируемся на {услуга}. Хотел бы обсудить возможность сотрудничества.'
    },
    {
      name: 'Предложение',
      text: 'Добрый день! У нас есть специальное предложение для компаний в сфере {отрасль}. Можем обсудить детали в удобное для вас время?'
    },
    {
      name: 'Встреча',
      text: 'Здравствуйте! Хотел бы предложить встречу для обсуждения взаимовыгодного сотрудничества. Когда вам будет удобно?'
    }
  ];

  const handleSend = () => {
    if (message.trim() && leadsCount > 0) {
      setIsSending(true);
      setTimeout(() => {
        onSend(message, platform);
        setIsSending(false);
        setMessage('');
      }, 1500);
    }
  };

  const platformNames: Record<string, string> = {
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    vk: 'ВКонтакте',
    email: 'Email'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="MessageSquare" size={24} />
          Массовая рассылка
        </CardTitle>
        <CardDescription>
          Отправьте сообщение всем найденным лидам ({leadsCount})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Шаблоны сообщений</Label>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <Button
                key={template.name}
                variant="outline"
                size="sm"
                onClick={() => setMessage(template.text)}
              >
                <Icon name="FileText" size={16} className="mr-2" />
                {template.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Канал отправки</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger id="platform">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">
                <div className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={16} />
                  WhatsApp
                </div>
              </SelectItem>
              <SelectItem value="telegram">
                <div className="flex items-center gap-2">
                  <Icon name="Send" size={16} />
                  Telegram
                </div>
              </SelectItem>
              <SelectItem value="vk">
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={16} />
                  ВКонтакте
                </div>
              </SelectItem>
              <SelectItem value="email">
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  Email
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Текст сообщения</Label>
          <Textarea
            id="message"
            placeholder="Введите текст сообщения для рассылки..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{message.length} символов</span>
            {message.length > 0 && (
              <Badge variant="outline">
                {leadsCount} получателей
              </Badge>
            )}
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || leadsCount === 0 || isSending}
          className="w-full"
          size="lg"
        >
          {isSending ? (
            <>
              <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
              Отправка...
            </>
          ) : (
            <>
              <Icon name="Send" size={20} className="mr-2" />
              Отправить в {platformNames[platform]} ({leadsCount})
            </>
          )}
        </Button>

        {leadsCount === 0 && (
          <div className="text-center text-sm text-muted-foreground p-4 bg-muted rounded-lg">
            <Icon name="AlertCircle" size={20} className="mx-auto mb-2" />
            Сначала сгенерируйте лиды для отправки сообщений
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageComposer;
