'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Settings, Save, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface Setting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  category: string;
  description: string;
  is_public: boolean;
}

export default function SuperadminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [changedSettings, setChangedSettings] = useState<Set<string>>(new Set());

  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading: authLoading, user } = useAuth({
    requireAuth: true,
    requiredRole: 'superadmin',
  });

  useEffect(() => {
    checkSuperadminAccess();
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const checkSuperadminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: superadmin } = await supabase
        .from('superadmins')
        .select('*')
        .eq('id', user.id)
        .eq('is_active', true)
        .single();

      if (!superadmin) {
        router.push('/');
        return;
      }

      loadSettings();
    } catch (error) {
      console.error('Error checking access:', error);
      router.push('/');
    }
  };

  const loadSettings = async () => {
    try {
      setIsLoading(true);

      const { data, error }: { data: any, error: any } = await supabase
        .from('global_settings' as any)
        .select('*')
        .order('category', { ascending: true })
        .order('setting_key', { ascending: true });

      if (error) throw error;

      // Parse JSON values
      const parsedSettings = (data || []).map(setting => ({
        ...setting,
        setting_value: setting.setting_type === 'json'
          ? JSON.parse(setting.setting_value as string)
          : setting.setting_value
      }));

      setSettings(parsedSettings as Setting[]);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (settingKey: string, newValue: any) => {
    setSettings(prev =>
      prev.map(s =>
        s.setting_key === settingKey
          ? { ...s, setting_value: newValue }
          : s
      )
    );
    setChangedSettings(prev => new Set([...prev, settingKey]));
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Save only changed settings
      const settingsToUpdate = settings.filter(s =>
        changedSettings.has(s.setting_key)
      );

      for (const setting of settingsToUpdate) {
        const { error } = await supabase
          .from('global_settings' as any)
          .update({
            setting_value: JSON.stringify(setting.setting_value),
            last_updated_by: user?.id,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', setting.setting_key);

        if (error) throw error;

        // Log the change
        await supabase.from('admin_audit_log').insert({
          admin_id: user?.id,
          action_type: 'update',
          resource_type: 'setting',
          resource_id: setting.id,
          changes: {
            setting_key: setting.setting_key,
            new_value: setting.setting_value
          },
          metadata: {
            category: setting.category
          }
        });
      }

      setChangedSettings(new Set());
      toast({
        title: 'Settings saved',
        description: `Updated ${settingsToUpdate.length} setting(s)`,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetChanges = () => {
    loadSettings();
    setChangedSettings(new Set());
    toast({
      title: 'Changes discarded',
      description: 'Settings reset to saved values',
    });
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.category === category);
  };

  const renderSettingInput = (setting: Setting) => {
    switch (setting.setting_type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.setting_value === true}
            onCheckedChange={(checked) =>
              updateSetting(setting.setting_key, checked)
            }
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={setting.setting_value}
            onChange={(e) =>
              updateSetting(setting.setting_key, parseInt(e.target.value))
            }
          />
        );

      case 'string':
      default:
        return (
          <Input
            type="text"
            value={setting.setting_value}
            onChange={(e) =>
              updateSetting(setting.setting_key, e.target.value)
            }
          />
        );
    }
  };

  const categories = Array.from(new Set(settings.map(s => s.category)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/superadmin">
                <Button variant="ghost" size="sm">
                  ← Back
                </Button>
              </Link>
              <Settings className="w-6 h-6 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold">Global Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Configure system-wide settings
                </p>
              </div>
            </div>

            {changedSettings.size > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={resetChanges}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Discard Changes
                </Button>
                <Button onClick={saveSettings} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  Save {changedSettings.size} Change{changedSettings.size !== 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {isLoading ? (
            <div className="text-center py-12">Loading settings...</div>
          ) : (
            <Tabs defaultValue={categories[0]} className="space-y-6">
              <TabsList>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map(category => (
                <TabsContent key={category} value={category}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {category.charAt(0).toUpperCase() + category.slice(1)} Settings
                      </CardTitle>
                      <CardDescription>
                        Configure {category} related settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {getSettingsByCategory(category).map(setting => (
                        <div key={setting.setting_key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <Label htmlFor={setting.setting_key}>
                                {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {setting.description}
                              </p>
                            </div>
                            <div className="w-64">
                              {renderSettingInput(setting)}
                            </div>
                          </div>
                          {changedSettings.has(setting.setting_key) && (
                            <div className="text-xs text-orange-600">
                              • Unsaved changes
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}

        </div>
      </div>
    </div>
  );
}

