// ============================================================
// CloudBase PG 兼容层（supabase-js 风格 API → CloudBase PostgREST）
// ------------------------------------------------------------
// CloudBase PG 的 REST API 基于 PostgREST（与 Supabase 同源），
// 查询语法完全一致，差异仅在：端点路径、鉴权头。
// 本适配层实现巡课系统用到的最小 API 面：
//   from(table).select/insert/update/upsert/delete
//     + eq/order/limit/range/or/not/maybeSingle
// 用法：window.APP_CONFIG.backend === 'cloudbase' 时启用。
// ============================================================
function createCloudBaseClient(cfg) {
  // cfg: { envId, publishableKey }
  const BASE = 'https://' + cfg.envId + '.api.tcloudbasegateway.com/v1/rdb/rest';
  const HEAD = {
    'apikey': cfg.publishableKey,
    'Authorization': 'Bearer ' + cfg.publishableKey,
    'Content-Type': 'application/json'
  };

  class Builder {
    constructor(method, table) {
      this._m = method; this._t = table;
      this._params = {}; this._filters = [];
      this._body = undefined; this._headers = Object.assign({}, HEAD);
      this._prefer = []; this._single = false; this._maybeSingle = false;
    }
    delete() { return this; }
    select(cols) {
      this._params.select = cols || '*';
      if (this._m === 'POST' || this._m === 'PATCH' || this._m === 'DELETE') this._prefer.push('return=representation');
      return this;
    }
    insert(rows) { this._body = rows; return this; }
    upsert(rows, opts) {
      this._body = rows;
      this._prefer.push('resolution=merge-duplicates');
      if (opts && opts.onConflict) this._params['on_conflict'] = opts.onConflict;
      return this;
    }
    update(obj) { this._body = obj; return this; }
    eq(c, v) { this._filters.push(c + '=eq.' + enc(v)); return this; }
    neq(c, v) { this._filters.push(c + '=neq.' + enc(v)); return this; }
    gte(c, v) { this._filters.push(c + '=gte.' + enc(v)); return this; }
    lte(c, v) { this._filters.push(c + '=lte.' + enc(v)); return this; }
    not(c, op, v) { this._filters.push(c + '=not.' + op + '.' + enc(v)); return this; }
    or(expr) { this._filters.push('or=(' + expr + ')'); return this; }
    order(c, opts) {
      const dir = (opts && opts.ascending === false) ? 'desc' : 'asc';
      this._params.order = c + '.' + dir; return this;
    }
    limit(n) { this._params.limit = n; return this; }
    range(from, to) { this._params.offset = from; this._params.limit = to - from + 1; return this; }
    maybeSingle() { this._maybeSingle = true; return this; }
    single() { this._single = true; return this; }
    async _exec() {
      let url = BASE + '/' + this._t;
      const qs = this._filters.concat(Object.keys(this._params).map(k => k + '=' + this._params[k]));
      if (qs.length) url += '?' + qs.join('&');
      const headers = Object.assign({}, this._headers);
      if (this._prefer.length) headers['Prefer'] = this._prefer.join(',');
      try {
        const r = await fetch(url, { method: this._m, headers, body: this._body === undefined ? undefined : JSON.stringify(this._body) });
        let data = null;
        const text = await r.text();
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
        if (!r.ok) {
          const msg = (data && (data.message || data.error_description || data.error)) || ('HTTP ' + r.status + ' ' + (text || '').slice(0, 120));
          return { data: null, error: { message: msg, code: data && data.code, details: data && data.details, hint: data && data.hint } };
        }
        if (this._maybeSingle) return { data: Array.isArray(data) ? (data[0] || null) : data, error: null };
        if (this._single) {
          if (Array.isArray(data) && data.length !== 1) return { data: null, error: { message: 'JSON object requested, multiple (or no) rows returned' } };
          return { data: Array.isArray(data) ? data[0] : data, error: null };
        }
        return { data, error: null };
      } catch (e) {
        return { data: null, error: { message: e.message || '网络请求失败' } };
      }
    }
    then(res, rej) { return this._exec().then(res, rej); }
    catch(rej) { return this._exec().catch(rej); }
  }
  function enc(v) {
    if (v === null) return 'null';
    if (Array.isArray(v)) return '(' + v.map(x => '"' + String(x).replace(/"/g, '\\"') + '"').join(',') + ')';
    return encodeURIComponent(v);
  }

  return {
    from(t) {
      return {
        select: (c) => new Builder('GET', t).select(c),
        insert: (r) => new Builder('POST', t).insert(r),
        upsert: (r, o) => new Builder('POST', t).upsert(r, o),
        update: (o) => new Builder('PATCH', t).update(o),
        delete: () => new Builder('DELETE', t).delete(),
      };
    },
    // 存储接口在 cloudbase 模式下不使用（照片走 photo_data base64 列）
    storage: { from() { throw new Error('cloudbase 模式照片存储未启用'); } },
    // 兼容探测
    __mode: 'cloudbase'
  };
}
window.createCloudBaseClient = createCloudBaseClient;
