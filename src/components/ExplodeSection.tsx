import type { ReactNode } from 'react';
import styles from './ExplodeSection.module.css';

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
      className={height === '340vh' ? `${styles.secExplode} ${styles.h340}` : styles.secExplode}
      data-dark
      data-explode
    >
      <div className={styles.exStage} data-ex-stage>
        <div className={styles.exGrid}>
          <div>
            <div className="sheet-head mb64" data-ex-head>
              <span className="tech">{canvasHead}</span>
              <span className={`tech ${styles.exHint}`}>Прокрутите</span>
            </div>
            <div className={styles.exCanvas}>
              <tile-3d kind={kind} mode="explode" className={styles.ex3d} />
              {canvasExtra}
            </div>
          </div>
          <div>
            <div className="sheet-head">
              <span className="tech tech-300">{head}</span>
              <span className="tech">{headRight}</span>
            </div>
            <h2 className="h2-md">{title}</h2>
            <p className={styles.exLead}>{lead}</p>
            <div className={styles.exList}>
              {steps.map((s) => (
                <div className={styles.exStep} data-ex-step key={s.n}>
                  <span className={styles.exN}>{s.n}</span>
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
