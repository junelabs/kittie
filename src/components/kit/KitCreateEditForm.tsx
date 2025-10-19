"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Settings, 
  Users, 
  Image,
  Eye,
  EyeOff,
  Copy,
  Check
} from "lucide-react";
import { MediaKit, Section, Asset, TeamMember } from "../../../types";

interface KitCreateEditFormProps {
  kit: MediaKit;
  sections: Section[];
  assets: Asset[];
  teamMembers: TeamMember[];
  onKitChange: (kit: MediaKit) => void;
  onSectionsChange: (sections: Section[]) => void;
  onAssetsChange: (assets: Asset[]) => void;
  onTeamMembersChange: (teamMembers: TeamMember[]) => void;
  onSave: () => void;
  onCopyEmbed: () => void;
}

export function KitCreateEditForm({
  kit,
  sections,
  assets,
  teamMembers,
  onKitChange,
  onSectionsChange,
  onAssetsChange,
  onTeamMembersChange,
  onSave,
  onCopyEmbed
}: KitCreateEditFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [copiedColor, setCopiedColor] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  // Debounced updates to preview
  useEffect(() => {
    const timer = setTimeout(() => {
      // This will trigger preview updates
    }, 150);
    return () => clearTimeout(timer);
  }, [kit, sections, assets, teamMembers]);

  // Header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollElement = document.querySelector('[data-tab-content]');
      if (scrollElement) {
        setHeaderScrolled(scrollElement.scrollTop > 0);
      }
    };

    const scrollElement = document.querySelector('[data-tab-content]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [activeTab]);

  const handleKitChange = (field: keyof MediaKit, value: string | boolean | null) => {
    onKitChange({ ...kit, [field]: value });
  };

  const handleCopyColor = async () => {
    try {
      await navigator.clipboard.writeText(kit.brand_color || '#0f172a');
      setCopiedColor(true);
      setTimeout(() => setCopiedColor(false), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const addSection = (kind: 'assets' | 'team') => {
    const newSection: Section = {
      id: `section_${Date.now()}`,
      kit_id: kit.id,
      kind,
      title: kind === 'assets' ? 'Brand Assets' : 'Team',
      description: null,
      visible: true,
      order_index: sections.length,
      created_at: new Date().toISOString(),
    };
    onSectionsChange([...sections, newSection]);
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    onSectionsChange(
      sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    );
  };

  const removeSection = (sectionId: string) => {
    onSectionsChange(sections.filter(section => section.id !== sectionId));
    // Also remove associated assets and team members
    onAssetsChange(assets.filter(asset => asset.section_id !== sectionId));
    onTeamMembersChange(teamMembers.filter(member => member.section_id !== sectionId));
  };

  const addTeamMember = (sectionId: string) => {
    const newMember: TeamMember = {
      id: `member_${Date.now()}`,
      section_id: sectionId,
      name: 'New Team Member',
      role: null,
      photo_url: null,
      email: null,
      x_handle: null,
      linkedin_url: null,
      order_index: teamMembers.filter(m => m.section_id === sectionId).length,
      created_at: new Date().toISOString(),
    };
    onTeamMembersChange([...teamMembers, newMember]);
  };

  const updateTeamMember = (memberId: string, updates: Partial<TeamMember>) => {
    onTeamMembersChange(
      teamMembers.map(member =>
        member.id === memberId ? { ...member, ...updates } : member
      )
    );
  };

  const removeTeamMember = (memberId: string) => {
    onTeamMembersChange(teamMembers.filter(member => member.id !== memberId));
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Sticky Header */}
      <div className={`px-4 sm:px-6 py-6 border-b border-gray-200 bg-white flex-shrink-0 transition-all duration-200 ${
        headerScrolled ? 'shadow-sm' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create Media Kit</h2>
            <p className="text-sm text-gray-600 mt-2">Set up your media kit in just a few steps</p>
          </div>
          <div className="flex space-x-2 sm:space-x-3">
            <Button 
              variant="outline" 
              onClick={onCopyEmbed} 
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-3 sm:px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Copy Embed</span>
              <span className="sm:hidden">Copy</span>
            </Button>
            <Button 
              onClick={onSave} 
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-3 sm:px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 text-xs sm:text-sm"
            >
              Save Kit
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 sm:px-6 py-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-lg p-1 overflow-x-auto">
            <TabsTrigger 
              value="basic" 
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600 transition-all duration-200 text-xs sm:text-sm"
            >
              <Settings className="h-4 w-4" />
              <span className="font-medium hidden sm:inline">Basic</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sections" 
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600 transition-all duration-200 text-xs sm:text-sm"
            >
              <Image className="h-4 w-4" />
              <span className="font-medium hidden sm:inline">Sections</span>
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600 transition-all duration-200 text-xs sm:text-sm"
            >
              <Users className="h-4 w-4" />
              <span className="font-medium hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600 transition-all duration-200 text-xs sm:text-sm"
            >
              <Settings className="h-4 w-4" />
              <span className="font-medium hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 bg-gray-50">
        <div className="p-4 sm:p-8 h-full">
          <Tabs value={activeTab} className="h-full flex flex-col">
            {/* Basic Tab */}
            <TabsContent value="basic" className="space-y-8 mt-0 flex-1 overflow-y-auto" data-tab-content>
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="px-6 py-5 border-b border-gray-100">
                  <CardTitle className="text-base font-semibold text-gray-900">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-6 space-y-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Kit Name *</Label>
                    <Input
                      id="name"
                      value={kit.name}
                      onChange={(e) => handleKitChange('name', e.target.value)}
                      placeholder="Enter your media kit name"
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                      id="description"
                      value={kit.description || ''}
                      onChange={(e) => handleKitChange('description', e.target.value)}
                      placeholder="A brief description of your media kit"
                      rows={3}
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm resize-none transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">This description will appear on your public media kit page.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="brandColor" className="text-sm font-medium text-gray-700">Brand Color</Label>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors duration-200"
                        style={{ backgroundColor: kit.brand_color || '#0f172a' }}
                        onClick={() => document.getElementById('brandColor')?.click()}
                      />
                      <Input
                        id="brandColor"
                        type="color"
                        value={kit.brand_color || '#0f172a'}
                        onChange={(e) => handleKitChange('brand_color', e.target.value)}
                        className="w-12 h-12 p-1 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors duration-200"
                        style={{ padding: '2px' }}
                      />
                      <div className="flex-1">
                        <Input
                          value={kit.brand_color || '#0f172a'}
                          onChange={(e) => handleKitChange('brand_color', e.target.value)}
                          placeholder="#0f172a"
                          className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm font-mono transition-all duration-200"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyColor}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2.5 h-10 transition-all duration-200 hover:scale-[1.02]"
                      >
                        {copiedColor ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">Choose a color that represents your brand</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="primaryCtaLabel" className="text-sm font-medium text-gray-700">Primary Button Label</Label>
                    <Input
                      id="primaryCtaLabel"
                      value={kit.primary_cta_label || ''}
                      onChange={(e) => handleKitChange('primary_cta_label', e.target.value)}
                      placeholder="Download All Assets"
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="primaryCtaAction" className="text-sm font-medium text-gray-700">Primary Button Action</Label>
                    <Select
                      value={kit.primary_cta_action}
                      onValueChange={(value: 'downloadAll' | 'openUrl') => handleKitChange('primary_cta_action', value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="downloadAll">Download All Assets</SelectItem>
                        <SelectItem value="openUrl">Open External URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {kit.primary_cta_action === 'openUrl' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="primaryCtaUrl" className="text-sm font-medium text-gray-700">External URL</Label>
                      <Input
                        id="primaryCtaUrl"
                        value={kit.primary_cta_url || ''}
                        onChange={(e) => handleKitChange('primary_cta_url', e.target.value)}
                        placeholder="https://example.com"
                        className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-1">
                      <Label htmlFor="isPublic" className="text-sm font-medium text-gray-700">Make Public</Label>
                      <p className="text-xs text-gray-500">Allow others to view and download your kit</p>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={kit.is_public}
                      onCheckedChange={(checked) => handleKitChange('is_public', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Test content to force scrolling */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="px-6 py-5 border-b border-gray-100">
                  <CardTitle className="text-base font-semibold text-gray-900">Test Content 1</CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-6 space-y-6">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Test Field 1</Label>
                    <Input
                      placeholder="This should be scrollable"
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Test Field 2</Label>
                    <Input
                      placeholder="More content to scroll"
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Test Field 3</Label>
                    <Textarea
                      placeholder="Enter longer text here to test scrolling"
                      rows={4}
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm resize-none transition-all duration-200"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="px-6 py-5 border-b border-gray-100">
                  <CardTitle className="text-base font-semibold text-gray-900">Test Content 2</CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-6 space-y-6">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Test Field 4</Label>
                    <Input
                      placeholder="This should be scrollable"
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Test Field 5</Label>
                    <Input
                      placeholder="More content to scroll"
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Test Field 6</Label>
                    <Textarea
                      placeholder="Enter longer text here to test scrolling"
                      rows={4}
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm resize-none transition-all duration-200"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="px-6 py-5 border-b border-gray-100">
                  <CardTitle className="text-base font-semibold text-gray-900">Test Content 3</CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-6 space-y-6">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Test Field 7</Label>
                    <Input
                      placeholder="This should be scrollable"
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Test Field 8</Label>
                    <Input
                      placeholder="More content to scroll"
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-gray-700">Test Field 9</Label>
                    <Textarea
                      placeholder="Enter longer text here to test scrolling"
                      rows={4}
                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm resize-none transition-all duration-200"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sections Tab */}
            <TabsContent value="sections" className="space-y-8 mt-0 flex-1 overflow-y-auto" data-tab-content>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Sections</h3>
                <div className="flex space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addSection('assets')}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Assets Section
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addSection('team')}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Section
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {sections.map((section) => (
                  <Card key={section.id} className="border border-gray-200 shadow-sm">
                    <CardHeader className="px-6 py-5 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <CardTitle className="text-base font-semibold text-gray-900">
                            {section.title} ({section.kind})
                          </CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateSection(section.id, { visible: !section.visible })}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 h-8 w-8 p-0 transition-all duration-200 hover:scale-[1.02]"
                          >
                            {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeSection(section.id)}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 h-8 w-8 p-0 transition-all duration-200 hover:scale-[1.02]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 py-6 space-y-6">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">Section Title</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          placeholder="Section title"
                          className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">Description</Label>
                        <Textarea
                          value={section.description || ''}
                          onChange={(e) => updateSection(section.id, { description: e.target.value })}
                          placeholder="Optional section description"
                          rows={2}
                          className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm resize-none transition-all duration-200"
                        />
                      </div>
                      {section.kind === 'assets' && (
                        <p className="text-xs text-gray-500">
                          {assets.filter(asset => asset.section_id === section.id).length} assets
                        </p>
                      )}
                      {section.kind === 'team' && (
                        <p className="text-xs text-gray-500">
                          {teamMembers.filter(member => member.section_id === section.id).length} team members
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-8 mt-0 flex-1 overflow-y-auto" data-tab-content>
              <div className="space-y-6">
                {sections
                  .filter(section => section.kind === 'team')
                  .map(section => (
                    <Card key={section.id} className="border border-gray-200 shadow-sm">
                      <CardHeader className="px-6 py-5 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-semibold text-gray-900">{section.title}</CardTitle>
                          <Button
                            size="sm"
                            onClick={() => addTeamMember(section.id)}
                            className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Member
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 py-6 space-y-6">
                        {teamMembers
                          .filter(member => member.section_id === section.id)
                          .map(member => (
                            <div key={member.id} className="p-6 border border-gray-200 rounded-lg space-y-6">
                              <div className="flex items-center justify-between">
                                <h4 className="text-base font-semibold text-gray-900">Team Member</h4>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeTeamMember(member.id)}
                                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 h-8 w-8 p-0 transition-all duration-200 hover:scale-[1.02]"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium text-gray-700">Name</Label>
                                  <Input
                                    value={member.name}
                                    onChange={(e) => updateTeamMember(member.id, { name: e.target.value })}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium text-gray-700">Role</Label>
                                  <Input
                                    value={member.role || ''}
                                    onChange={(e) => updateTeamMember(member.id, { role: e.target.value })}
                                    placeholder="e.g., CEO, Designer"
                                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                                  <Input
                                    type="email"
                                    value={member.email || ''}
                                    onChange={(e) => updateTeamMember(member.id, { email: e.target.value })}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-sm font-medium text-gray-700">X Handle</Label>
                                  <Input
                                    value={member.x_handle || ''}
                                    onChange={(e) => updateTeamMember(member.id, { x_handle: e.target.value })}
                                    placeholder="@username"
                                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                                  />
                                </div>
                                <div className="space-y-1.5 col-span-2">
                                  <Label className="text-sm font-medium text-gray-700">LinkedIn URL</Label>
                                  <Input
                                    value={member.linkedin_url || ''}
                                    onChange={(e) => updateTeamMember(member.id, { linkedin_url: e.target.value })}
                                    placeholder="https://linkedin.com/in/username"
                                    className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2.5 text-sm transition-all duration-200"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-8 mt-0 flex-1 overflow-y-auto" data-tab-content>
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="px-6 py-5 border-b border-gray-100">
                  <CardTitle className="text-base font-semibold text-gray-900">Display Settings</CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-6 space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-1">
                      <Label htmlFor="showPoweredBy" className="text-sm font-medium text-gray-700">Show &quot;Powered by Kittie&quot;</Label>
                      <p className="text-xs text-gray-500">Display branding in the footer</p>
                    </div>
                    <Switch
                      id="showPoweredBy"
                      checked={kit.show_powered_by}
                      onCheckedChange={(checked) => handleKitChange('show_powered_by', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}