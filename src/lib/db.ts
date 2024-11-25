import { createDbWorker } from 'sql.js-httpvfs';

const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
);
const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url);

export interface Note {
  id: number;
  content: string;
  imported: boolean;
  skipped: boolean;
  created_at: string;
  updated_at: string;
}

let worker: Awaited<ReturnType<typeof createDbWorker>> | null = null;

export async function initDatabase(path: string) {
  worker = await createDbWorker(
    [
      {
        from: 'inline',
        config: {
          serverMode: 'full',
          url: path,
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  await worker.db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      imported BOOLEAN NOT NULL DEFAULT 0,
      skipped BOOLEAN NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return worker;
}

export async function getNotes(filter: 'pending' | 'imported' | 'deleted'): Promise<Note[]> {
  if (!worker) throw new Error('Database not initialized');

  const condition = filter === 'pending' 
    ? 'imported = 0 AND skipped = 0'
    : filter === 'imported'
    ? 'imported = 1'
    : 'skipped = 1';

  const result = await worker.db.query(`
    SELECT * FROM notes 
    WHERE ${condition}
    ORDER BY created_at DESC
  `);

  return result.map((row) => ({
    id: row[0] as number,
    content: row[1] as string,
    imported: Boolean(row[2]),
    skipped: Boolean(row[3]),
    created_at: row[4] as string,
    updated_at: row[5] as string,
  }));
}

export async function createNote(content: string): Promise<Note> {
  if (!worker) throw new Error('Database not initialized');

  await worker.db.exec({
    sql: `
      INSERT INTO notes (content)
      VALUES (?);
    `,
    bind: [content],
  });

  const result = await worker.db.query('SELECT * FROM notes WHERE id = last_insert_rowid()');
  return {
    id: result[0][0] as number,
    content: result[0][1] as string,
    imported: Boolean(result[0][2]),
    skipped: Boolean(result[0][3]),
    created_at: result[0][4] as string,
    updated_at: result[0][5] as string,
  };
}

export async function updateNote(id: number, content: string): Promise<void> {
  if (!worker) throw new Error('Database not initialized');

  await worker.db.exec({
    sql: `
      UPDATE notes 
      SET content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `,
    bind: [content, id],
  });
}

export async function markNoteAs(id: number, status: 'imported' | 'skipped'): Promise<void> {
  if (!worker) throw new Error('Database not initialized');

  await worker.db.exec({
    sql: `
      UPDATE notes 
      SET ${status} = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `,
    bind: [id],
  });
}

export async function deleteNote(id: number): Promise<void> {
  if (!worker) throw new Error('Database not initialized');

  await worker.db.exec({
    sql: 'DELETE FROM notes WHERE id = ?;',
    bind: [id],
  });
}

export async function splitNotes(content: string, separator: string): Promise<string[]> {
  const lines = content.split('\n');
  const notes: string[] = [];
  let currentNote: string[] = [];

  for (const line of lines) {
    if (line.includes(separator)) {
      if (currentNote.length > 0) {
        notes.push(currentNote.join('\n'));
        currentNote = [];
      }
    }
    currentNote.push(line);
  }

  if (currentNote.length > 0) {
    notes.push(currentNote.join('\n'));
  }

  return notes;
}