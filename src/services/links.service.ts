import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

interface Link {
  data: {
    slug: string;
    destination: string;
  };
}

export default {
  async getAll(): Promise<Link[]> {
    return await client.query(q.Map(q.Paginate(q.Match(q.Index('links'))), ref => q.Get(ref)));
  },
  async get(slug: string): Promise<Link> {
    return await client.query(q.Get(q.Match(q.Index('links'), slug)));
  },
  async create(slug: string, destination: string) {
    return await client.query(q.Create(q.Collection('links'), { data: { slug, destination } }));
  },
  async delete(slug: string) {
    return await client.query(q.Delete(q.Match(q.Index('links'), slug)));
  },
};
