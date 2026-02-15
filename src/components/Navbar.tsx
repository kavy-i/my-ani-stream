import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Settings, Play, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApiConfig } from '@/hooks/use-api-config';

const ANIME_PROVIDERS = ['gogoanime', 'zoro', '9anime', 'animefox', 'animepahe', 'enime'];
const MANGA_PROVIDERS = ['mangadex', 'mangahere', 'mangakakalot', 'mangapark', 'mangapill', 'mangareader', 'mangasee123'];

export function Navbar() {
  const navigate = useNavigate();
  const { apiUrl, setApiUrl, animeProvider, setAnimeProvider, mangaProvider, setMangaProvider } = useApiConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [tempUrl, setTempUrl] = useState(apiUrl);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[1800px] items-center gap-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Play className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">AniTube</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-xl mx-auto">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anime or manga..."
            className="rounded-r-none border-r-0 bg-secondary focus-visible:ring-0"
          />
          <Button type="submit" variant="secondary" className="rounded-l-none border border-border px-5">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Provider selectors */}
        <div className="hidden lg:flex items-center gap-2">
          <Select value={animeProvider} onValueChange={setAnimeProvider}>
            <SelectTrigger className="w-[130px] h-8 text-xs bg-secondary">
              <Play className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ANIME_PROVIDERS.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={mangaProvider} onValueChange={setMangaProvider}>
            <SelectTrigger className="w-[130px] h-8 text-xs bg-secondary">
              <BookOpen className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MANGA_PROVIDERS.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Settings */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Settings className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Consumet API URL</label>
                <Input
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://your-api.vercel.app"
                />
                <Button onClick={() => setApiUrl(tempUrl)} className="w-full">
                  Save API URL
                </Button>
              </div>
              <div className="space-y-2 lg:hidden">
                <label className="text-sm font-medium">Anime Provider</label>
                <Select value={animeProvider} onValueChange={setAnimeProvider}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ANIME_PROVIDERS.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <label className="text-sm font-medium">Manga Provider</label>
                <Select value={mangaProvider} onValueChange={setMangaProvider}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MANGA_PROVIDERS.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}
