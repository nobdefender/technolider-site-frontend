import type { ReactNode } from 'react';

type Step = { n: string; t: string; tech: string };

type Props = {
  kind: 'housing' | 'mast' | 'dims' | 'pcbasm' | 'docs';
  /** Высота секции (длина прокрутки закреплённой сцены): '360vh' | '340vh'. */
  height?: '360vh' | '340vh';
  canvasHead: string;
  head: string;
  headRight: string;
  title: string;
  lead: string;
  steps: Step[];
  /** Дополнительные элементы внутри холста (например, выноски размеров). */
  canvasExtra?: ReactNode;
};

/**
 * Секция «разнесённый вид»: закреплённая 3D-сцена, которая разбирается по мере прокрутки,
 * и список шагов справа (подсвечивается элементом <tile-3d mode="explode">).
 */
export function ExplodeSection({
  kind,
  height = '360vh',
  canvasHead,
  head,
  headRight,
  title,
  lead,
  steps,
  canvasExtra,
}: Props) {
  return (
    <section
      className={height === '340vh' ? 'sec-explode h340' : 'sec-explode'}
      data-dark
      data-explode
    >
      <div className="ex-stage">
        <div className="ex-grid">
          <div>
            <div className="sheet-head mb64">
              <span className="tech">{canvasHead}</span>
              <span className="tech ex-hint">Прокрутите</span>
            </div>
            <div className="ex-canvas">
              <tile-3d kind={kind} mode="explode" className="ex-3d" />
              {canvasExtra}
            </div>
          </div>
          <div>
            <div className="sheet-head">
              <span className="tech tech-300">{head}</span>
              <span className="tech">{headRight}</span>
            </div>
            <h2 className="h2-md">{title}</h2>
            <p className="ex-lead">{lead}</p>
            <div className="ex-list">
              {steps.map((s) => (
                <div className="ex-step" data-ex-step key={s.n}>
                  <span className="ex-n">{s.n}</span>
                  <span>{s.t}</span>
                  <span className="tech">{s.tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
