interface FooterProps {
  t: any;
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-lumina-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full blur-[1px]" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Lumina AI</span>
            </div>
            <p className="text-lumina-500 max-w-sm mb-8">
              {t.desc}
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Discord', 'YouTube', 'GitHub'].map((social) => (
                <a key={social} href="#" className="h-10 w-10 bg-lumina-50 border border-lumina-200 rounded-full flex items-center justify-center text-lumina-600 hover:text-accent hover:border-accent transition-all">
                  <span className="text-[10px] font-bold uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-lumina-500 hover:text-accent transition-colors">About</a></li>
              <li><a href="#" className="text-lumina-500 hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="text-lumina-500 hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="text-lumina-500 hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-lumina-500 hover:text-accent transition-colors">Models</a></li>
              <li><a href="#" className="text-lumina-500 hover:text-accent transition-colors">API Docs</a></li>
              <li><a href="#" className="text-lumina-500 hover:text-accent transition-colors">Showcase</a></li>
              <li><a href="#" className="text-lumina-500 hover:text-accent transition-colors">Join Discord</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-lumina-100 text-center md:flex md:justify-between md:text-left">
          <p className="text-sm text-lumina-400 mb-4 md:mb-0">
            {t.rights}
          </p>
          <div className="flex justify-center md:justify-end gap-8">
            <a href="#" className="text-sm text-lumina-400 hover:text-accent">Privacy Policy</a>
            <a href="#" className="text-sm text-lumina-400 hover:text-accent">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
