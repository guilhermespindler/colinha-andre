import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Smartphone, Share2, Download, Check } from 'lucide-react';

type Position = {
  id: string;
  title: string;
  digits: number;
  lockedValue?: string;
  lockedName?: string;
};

const POSITIONS: Position[] = [
  { id: 'federal', title: 'Deputado Federal', digits: 4, lockedValue: '3010', lockedName: 'André de Oliveira' },
  { id: 'estadual', title: 'Deputado Estadual', digits: 5 },
  { id: 'senador1', title: 'Senador (1º voto)', digits: 3 },
  { id: 'senador2', title: 'Senador (2º voto)', digits: 3 },
  { id: 'governador', title: 'Governador', digits: 2 },
  { id: 'presidente', title: 'Presidente', digits: 2 },
];

function App() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [device, setDevice] = useState<'android' | 'iphone'>('android');
  const [copied, setCopied] = useState(false);
  const colinhaRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (id: string, value: string, maxDigits: number) => {
    // Only allow numbers
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, maxDigits);
    setValues(prev => ({ ...prev, [id]: cleanValue }));
  };

  const handleGenerate = async () => {
    if (!colinhaRef.current) return;
    try {
      const btnText = document.getElementById('btn-generate-text');
      if (btnText) btnText.innerText = 'Gerando...';

      const dataUrl = await toPng(colinhaRef.current, {
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = 'minha-colinha-andre-3010.png';
      link.href = dataUrl;
      // Append to body is required in some browsers (like Firefox) for the click to work
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (btnText) btnText.innerText = 'Gerar colinha';
    } catch (err: any) {
      console.error('Failed to generate image', err);
      alert('Erro ao gerar a imagem: ' + (err.message || err));
      const btnText = document.getElementById('btn-generate-text');
      if (btnText) btnText.innerText = 'Gerar colinha';
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-brand-gradient px-4 py-8 font-display">
      <div className="mx-auto w-full max-w-[420px]">
        
        <div className="mb-8 flex justify-center">
          <img 
            src="/selo-andre.png" 
            alt="André de Oliveira" 
            className="h-auto w-[240px] max-w-full drop-shadow-md" 
            onError={(e) => {
              // Fallback to text if image not found
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        <h1 className="mb-2 text-center text-3xl font-black uppercase leading-none tracking-tight text-white">
          Colinha de votação
        </h1>
        <p className="mb-8 text-center text-sm text-white/80">
          Preencha com o número de seus candidatos!
        </p>

        {/* Device selector */}
        <div className="mb-6 flex gap-2" role="group">
          <button 
            type="button" 
            onClick={() => setDevice('android')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              device === 'android' ? 'border-brand-yellow bg-brand-yellow text-deep-blue' : 'border-white/40 text-white'
            }`}
          >
            <Smartphone size={16} />
            Android
          </button>
          <button 
            type="button" 
            onClick={() => setDevice('iphone')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              device === 'iphone' ? 'border-brand-yellow bg-brand-yellow text-deep-blue' : 'border-white/40 text-white'
            }`}
          >
            <Smartphone size={16} />
            iPhone
          </button>
        </div>

        {/* The Card */}
        <div className="rounded-[1.6rem] bg-brand-yellow p-2 shadow-2xl">
          <div ref={colinhaRef} className="rounded-[1.1rem] bg-white px-4 py-5 shadow-lg">
            
            <div className="mb-4 flex items-baseline justify-between border-b border-gray-100 pb-2">
              <span className="text-xl font-black uppercase tracking-tight text-deep-blue">Minha colinha</span>
              <span className="text-xs font-bold uppercase text-novo-orange">Eleições 2026</span>
            </div>

            <ul className="flex flex-col gap-3">
              {POSITIONS.map((pos) => {
                const isLocked = !!pos.lockedValue;
                const currentValue = (isLocked ? pos.lockedValue : values[pos.id]) || '';
                
                return (
                  <li key={pos.id} className="relative flex items-center gap-4 rounded-xl p-2 transition-colors">
                    
                    <div className="flex h-14 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                      {isLocked ? (
                        <img src="/foto-colinha.jpg" alt="Candidato" className="h-full w-full object-cover object-top" />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-300" />
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-deep-blue/60">
                        {pos.title}
                      </p>
                      <p className="text-xs font-semibold text-deep-blue/80">
                        {isLocked ? pos.lockedName : `Digite ${pos.digits} dígitos`}
                      </p>
                    </div>

                    <div className="relative shrink-0 py-2">
                      {!isLocked && (
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={pos.digits}
                          value={currentValue}
                          onChange={(e) => handleInputChange(pos.id, e.target.value, pos.digits)}
                          className="hide-number-input absolute inset-x-0 -inset-y-1 z-10 h-[calc(100%+0.5rem)] w-full cursor-text opacity-0"
                        />
                      )}
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: pos.digits }).map((_, i) => {
                          const digit = currentValue[i] || '';
                          return (
                            <span 
                              key={i} 
                              className={`relative flex h-10 w-8 items-center justify-center rounded-lg border-2 font-display text-lg font-black transition-colors ${
                                isLocked 
                                  ? 'border-novo-orange bg-novo-orange text-white' 
                                  : digit ? 'border-deep-blue bg-white text-deep-blue' : 'border-gray-200 bg-gray-50 text-deep-blue'
                              }`}
                            >
                              {digit}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex items-center gap-4 border-t border-gray-100 pt-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold leading-snug text-deep-blue">Confira sempre o número do candidato na urna.</p>
                <p className="mt-1 text-[10px] leading-snug text-deep-blue/60">ELEIÇÃO 2026 ANDRE DE OLIVEIRA DEPUTADO FEDERAL | CNPJ: 68.329.293/0001-99</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleGenerate}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 py-4 text-[17px] font-black uppercase tracking-tight text-deep-blue transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download size={20} />
          <span id="btn-generate-text">Gerar colinha</span>
        </button>

        <button 
          type="button"
          onClick={handleCopyLink}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-4 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          {copied ? 'Link Copiado!' : 'Copiar link da colinha'}
        </button>
      </div>
    </main>
  );
}

export default App;
