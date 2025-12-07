import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ThemeToggle';

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  industry: string;
  size: string;
  region: string;
  score: number;
  status: 'hot' | 'warm' | 'cold';
}

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [formData, setFormData] = useState({
    industry: '',
    region: '',
    companySize: '',
    count: '10'
  });

  const generateLeads = () => {
    setIsGenerating(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          const mockLeads: Lead[] = Array.from({ length: parseInt(formData.count) }, (_, i) => ({
            id: `LEAD-${String(i + 1).padStart(4, '0')}`,
            company: `${formData.industry || 'Tech'} Corp ${i + 1}`,
            contact: `Контакт ${i + 1}`,
            email: `contact${i + 1}@company.com`,
            industry: formData.industry || 'Технологии',
            size: formData.companySize || '50-200',
            region: formData.region || 'Москва',
            score: Math.floor(Math.random() * 40) + 60,
            status: i % 3 === 0 ? 'hot' : i % 2 === 0 ? 'warm' : 'cold'
          }));
          
          setLeads(mockLeads);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const generateCSV = () => {
    const headers = ['ID', 'Компания', 'Контакт', 'Email', 'Отрасль', 'Размер', 'Регион', 'Оценка', 'Статус'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => 
        [lead.id, lead.company, lead.contact, lead.email, lead.industry, lead.size, lead.region, lead.score, lead.status].join(',')
      )
    ].join('\n');
    return csvContent;
  };

  const exportData = (format: 'pdf' | 'csv' | 'excel') => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().getTime()}.csv`;
    a.click();
  };

  const shareToMessenger = (messenger: 'whatsapp' | 'telegram') => {
    const csvContent = generateCSV();
    const text = `Лиды (${leads.length} шт):\n\n${csvContent.split('\n').slice(0, 6).join('\n')}\n\n...и еще ${Math.max(0, leads.length - 5)} лидов`;
    
    if (messenger === 'whatsapp') {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    } else if (messenger === 'telegram') {
      const url = `https://t.me/share/url?url=${encodeURIComponent('')}&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-orange-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'hot': return 'Горячий';
      case 'warm': return 'Теплый';
      case 'cold': return 'Холодный';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">ИИ Генератор Лидов</h1>
            <p className="text-muted-foreground text-lg">Интеллектуальная система для поиска и квалификации потенциальных клиентов</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-primary" />
                Всего лидов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{leads.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Сгенерировано в текущей сессии</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="Flame" size={20} className="text-red-500" />
                Горячие лиды
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{leads.filter(l => l.status === 'hot').length}</div>
              <p className="text-sm text-muted-foreground mt-1">Высокий приоритет</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon name="Target" size={20} className="text-primary" />
                Средняя оценка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {leads.length > 0 ? Math.round(leads.reduce((acc, l) => acc + l.score, 0) / leads.length) : 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Из 100 возможных</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Settings" size={24} />
              Параметры генерации
            </CardTitle>
            <CardDescription>Настройте критерии поиска потенциальных клиентов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Отрасль</Label>
                <Select value={formData.industry} onValueChange={(val) => setFormData({...formData, industry: val})}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Выберите отрасль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Технологии">Технологии</SelectItem>
                    <SelectItem value="Финансы">Финансы</SelectItem>
                    <SelectItem value="Розница">Розница</SelectItem>
                    <SelectItem value="Производство">Производство</SelectItem>
                    <SelectItem value="Здравоохранение">Здравоохранение</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Регион</Label>
                <Select value={formData.region} onValueChange={(val) => setFormData({...formData, region: val})}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Выберите регион" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Москва">Москва</SelectItem>
                    <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                    <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
                    <SelectItem value="Новосибирск">Новосибирск</SelectItem>
                    <SelectItem value="Казань">Казань</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Размер компании</Label>
                <Select value={formData.companySize} onValueChange={(val) => setFormData({...formData, companySize: val})}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Выберите размер" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 сотрудников</SelectItem>
                    <SelectItem value="11-50">11-50 сотрудников</SelectItem>
                    <SelectItem value="51-200">51-200 сотрудников</SelectItem>
                    <SelectItem value="201-500">201-500 сотрудников</SelectItem>
                    <SelectItem value="500+">500+ сотрудников</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">Количество</Label>
                <Input 
                  id="count" 
                  type="number" 
                  min="1" 
                  max="100"
                  value={formData.count}
                  onChange={(e) => setFormData({...formData, count: e.target.value})}
                  placeholder="10"
                />
              </div>
            </div>

            {isGenerating && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Генерация лидов...</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={generateLeads} 
                disabled={isGenerating}
                className="flex-1 md:flex-none min-w-[200px]"
                size="lg"
              >
                <Icon name="Sparkles" size={20} className="mr-2" />
                {isGenerating ? 'Генерация...' : 'Сгенерировать лиды'}
              </Button>

              <Button 
                variant="outline" 
                onClick={() => exportData('csv')}
                disabled={leads.length === 0}
                size="lg"
              >
                <Icon name="FileSpreadsheet" size={20} className="mr-2" />
                CSV
              </Button>

              <Button 
                variant="outline" 
                onClick={() => exportData('excel')}
                disabled={leads.length === 0}
                size="lg"
              >
                <Icon name="Sheet" size={20} className="mr-2" />
                Excel
              </Button>

              <Button 
                variant="outline" 
                onClick={() => exportData('pdf')}
                disabled={leads.length === 0}
                size="lg"
              >
                <Icon name="FileText" size={20} className="mr-2" />
                PDF
              </Button>

              <Button 
                variant="outline" 
                onClick={() => shareToMessenger('whatsapp')}
                disabled={leads.length === 0}
                size="lg"
              >
                <Icon name="MessageCircle" size={20} className="mr-2" />
                WhatsApp
              </Button>

              <Button 
                variant="outline" 
                onClick={() => shareToMessenger('telegram')}
                disabled={leads.length === 0}
                size="lg"
              >
                <Icon name="Send" size={20} className="mr-2" />
                Telegram
              </Button>
            </div>
          </CardContent>
        </Card>

        {leads.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Database" size={24} />
                Результаты ({leads.length})
              </CardTitle>
              <CardDescription>Список сгенерированных потенциальных клиентов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Компания</TableHead>
                      <TableHead>Контакт</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Отрасль</TableHead>
                      <TableHead>Размер</TableHead>
                      <TableHead>Регион</TableHead>
                      <TableHead className="text-right">Оценка</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm">{lead.id}</TableCell>
                        <TableCell className="font-medium">{lead.company}</TableCell>
                        <TableCell>{lead.contact}</TableCell>
                        <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                        <TableCell>{lead.industry}</TableCell>
                        <TableCell>{lead.size}</TableCell>
                        <TableCell>{lead.region}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all" 
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <span className="font-semibold text-sm w-8">{lead.score}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.status)}>
                            {getStatusLabel(lead.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;