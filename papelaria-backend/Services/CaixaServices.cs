using MySql.Data.MySqlClient;
using papelaria_backend.Entities;

namespace papelaria_backend.Services
{
    public class CaixaServices
    {
        private readonly BD _bd;

        public CaixaServices(BD bd) { _bd = bd; }

        public bool SalvarCaixa(Caixa caixa)
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO Caixa (caixa_data, caixa_status) VALUES (@caixa_data, @caixa_status)";
            cmd.Parameters.AddWithValue("@caixa_data", caixa.data);
            cmd.Parameters.AddWithValue("@caixa_status", caixa.status);

            try
            {
                if (conn.State != System.Data.ConnectionState.Open) conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
            finally { conn.Close(); }
        }

        public IEnumerable<Caixa> ObterTodosCaixas()
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT * FROM Caixa";
            if (conn.State != System.Data.ConnectionState.Open) conn.Open();
            var dr = cmd.ExecuteReader();
            var caixas = new List<Caixa>();
            while (dr.Read())
            {
                caixas.Add(new Caixa
                {
                    id = Convert.ToInt32(dr["caixa_id"]),
                    data = Convert.ToDateTime(dr["caixa_data"]),
                    status = Convert.ToBoolean(dr["caixa_status"])
                });
            }
            conn.Close();
            return caixas;
        }

        public Caixa? ObterCaixa(int id)
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT * FROM Caixa WHERE caixa_id = @caixa_id";
            cmd.Parameters.AddWithValue("@caixa_id", id);
            if (conn.State != System.Data.ConnectionState.Open) conn.Open();
            var dr = cmd.ExecuteReader();
            if (dr.Read())
            {
                var caixa = new Caixa
                {
                    id = Convert.ToInt32(dr["caixa_id"]),
                    data = Convert.ToDateTime(dr["caixa_data"]),
                    status = Convert.ToBoolean(dr["caixa_status"])
                };
                conn.Close();
                return caixa;
            }
            conn.Close();
            return null;
        }

        public bool AtualizarCaixa(Caixa caixa)
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"UPDATE Caixa SET caixa_data = @caixa_data, caixa_status = @caixa_status WHERE caixa_id = @caixa_id";
            cmd.Parameters.AddWithValue("@caixa_data", caixa.data);
            cmd.Parameters.AddWithValue("@caixa_status", caixa.status);
            cmd.Parameters.AddWithValue("@caixa_id", caixa.id);

            try
            {
                if (conn.State != System.Data.ConnectionState.Open) conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
            finally { conn.Close(); }
        }

        public bool DeletarCaixa(int id)
        {
            var conn = _bd.CriarConexao();
            MySqlCommand cmd = conn.CreateCommand();
            cmd.CommandText = @"DELETE FROM Caixa WHERE caixa_id = @caixa_id";
            cmd.Parameters.AddWithValue("@caixa_id", id);

            try
            {
                if (conn.State != System.Data.ConnectionState.Open) conn.Open();
                return cmd.ExecuteNonQuery() > 0;
            }
            finally { conn.Close(); }
        }
    }
}