using MySql.Data.MySqlClient;
using papelaria_backend.Entities;

namespace papelaria_backend.Services
{
    public class VendaCaixaServices
    {
        private readonly BD _bd;

        public VendaCaixaServices(BD bd) { _bd = bd; }

        public bool SalvarVendaCaixa(VendaCaixa vendaCaixa)
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO VendaCaixa (vendaCaixa_idVenda, vendaCaixa_idCaixa) VALUES (@vendaCaixa_idVenda, @vendaCaixa_idCaixa)";
            cmd.Parameters.AddWithValue("@vendaCaixa_idVenda", vendaCaixa.id_venda);
            cmd.Parameters.AddWithValue("@vendaCaixa_idCaixa", vendaCaixa.id_caixa);

            try
            {
                if (conn.State != System.Data.ConnectionState.Open) conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
            finally { conn.Close(); }
        }

        public IEnumerable<VendaCaixa> ObterTodosVendaCaixas()
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT * FROM VendaCaixa";
            if (conn.State != System.Data.ConnectionState.Open) conn.Open();
            var dr = cmd.ExecuteReader();
            var vendaCaixas = new List<VendaCaixa>();
            while (dr.Read())
            {
                vendaCaixas.Add(new VendaCaixa
                {
                    id = Convert.ToInt32(dr["vendaCaixa_id"]),
                    id_venda = Convert.ToInt32(dr["vendaCaixa_idVenda"]),
                    id_caixa = Convert.ToInt32(dr["vendaCaixa_idCaixa"])
                });
            }
            conn.Close();
            return vendaCaixas;
        }

        public VendaCaixa? ObterVendaCaixa(int id)
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT * FROM VendaCaixa WHERE vendaCaixa_id = @vendaCaixa_id";
            cmd.Parameters.AddWithValue("@vendaCaixa_id", id);
            if (conn.State != System.Data.ConnectionState.Open) conn.Open();
            var dr = cmd.ExecuteReader();
            if (dr.Read())
            {
                var vendaCaixa = new VendaCaixa
                {
                    id = Convert.ToInt32(dr["vendaCaixa_id"]),
                    id_venda = Convert.ToInt32(dr["vendaCaixa_idVenda"]),
                    id_caixa = Convert.ToInt32(dr["vendaCaixa_idCaixa"])
                };
                conn.Close();
                return vendaCaixa;
            }
            conn.Close();
            return null;
        }

        public bool AtualizarVendaCaixa(VendaCaixa vendaCaixa)
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"UPDATE VendaCaixa SET vendaCaixa_idVenda = @vendaCaixa_idVenda, vendaCaixa_idCaixa = @vendaCaixa_idCaixa WHERE vendaCaixa_id = @vendaCaixa_id";
            cmd.Parameters.AddWithValue("@vendaCaixa_idVenda", vendaCaixa.id_venda);
            cmd.Parameters.AddWithValue("@vendaCaixa_idCaixa", vendaCaixa.id_caixa);
            cmd.Parameters.AddWithValue("@vendaCaixa_id", vendaCaixa.id);

            try
            {
                if (conn.State != System.Data.ConnectionState.Open) conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
            finally { conn.Close(); }
        }

        public bool DeletarVendaCaixa(int id)
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"DELETE FROM VendaCaixa WHERE vendaCaixa_id = @vendaCaixa_id";
            cmd.Parameters.AddWithValue("@vendaCaixa_id", id);

            try
            {
                if (conn.State != System.Data.ConnectionState.Open) conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
            finally { conn.Close(); }
        }
    }
}