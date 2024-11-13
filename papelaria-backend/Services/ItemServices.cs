using MySql.Data.MySqlClient;
using papelaria_backend.Entities;
using System.ComponentModel;
using static papelaria_backend.Entities.Item;

namespace papelaria_backend.Services
{
    public class ItemServices
    {
        private readonly BD _bd;

        public ItemServices(BD bd)
        {
            _bd = bd;
        }

        public bool SalvarItem(Entities.Item item)
        {
            bool sucesso = false;
            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();

            cmd.CommandText = $@"INSERT INTO Item (item_nome,item_valor)
                                    VALUES(@item_nome,@item_valor)
            ";

            cmd.Parameters.AddWithValue("@item_nome", item.nome);
            cmd.Parameters.AddWithValue("@item_valor", item.valor);

            try
            {
                if (conexao.State != System.Data.ConnectionState.Open)
                    conexao.Open();

                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();

                cmd.CommandText = $@"SELECT LAST_INSERT_ID()";
                int id = Convert.ToInt32(cmd.ExecuteScalar());
                item.id = id;

                sucesso = true;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }

            return sucesso;
        }

        public bool SalvarProduto(Entities.Item.Produto produto)
        {
            bool sucesso = false;
            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();

            cmd.CommandText = $@"INSERT INTO Produto (produto_codbarra,Produto.item_id)
                                    VALUES(@produto_codbarra,@item_id)";

            cmd.Parameters.AddWithValue("@produto_codbarra", produto.cod_barra);
            cmd.Parameters.AddWithValue("@item_id", produto.id);

            try
            {
                if (conexao.State != System.Data.ConnectionState.Open)
                    conexao.Open();

                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();

                sucesso = true;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }

            return sucesso;
        }

        public bool SalvarServico(Entities.Item.Servico servico)
        {
            bool sucesso = false;
            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();

            cmd.CommandText = $@"INSERT INTO Servico (servico_disponivel,item_id)
                                    VALUES(@servico_disponivel,@item_id)";

            cmd.Parameters.AddWithValue("@servico_disponivel", servico.disponivel);
            cmd.Parameters.AddWithValue("@item_id", servico.id);

            try
            {
                if (conexao.State != System.Data.ConnectionState.Open)
                    conexao.Open();

                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();

                cmd.CommandText = $@"SELECT LAST_INSERT_ID()";
                int id = Convert.ToInt32(cmd.ExecuteScalar());
                servico.id = id;

                sucesso = true;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }

            return sucesso;
        }

        public IEnumerable<Entities.Item.Produto> ObterTodosProdutos()
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT Item.item_id, Item.item_nome, Item.item_valor, Produto.produto_codbarra as item_codbarra
                                FROM Item
                                INNER JOIN Produto ON Item.item_id = Produto.item_id";

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            List<Item.Produto> produtos = new List<Item.Produto>();
            while (dr.Read())
            {

                produtos.Add(new Item.Produto()
                {
                    id = Convert.ToInt32(dr["item_id"]),
                    nome = dr["item_nome"].ToString(),
                    valor = (float)dr["item_valor"],
                    cod_barra = dr["item_codbarra"].ToString()
                });
            }
            conn.Close();

            return produtos;
        }

        public IEnumerable<Entities.Item.Servico> ObterTodosServicos()
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT Item.item_id, Item.item_nome, Item.item_valor, Servico.servico_disponivel as item_disponivel
                                FROM Item
                                INNER JOIN Servico ON Item.item_id = Servico.item_id";

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            List<Item.Servico> servicos = new List<Item.Servico>();
            while (dr.Read())
            {

                servicos.Add(new Item.Servico()
                {
                    id = Convert.ToInt32(dr["item_id"]),
                    nome = dr["item_nome"].ToString(),
                    valor = (float)dr["item_valor"],
                    disponivel = (bool)dr["item_disponivel"]
                });
            }
            conn.Close();

            return servicos;
        }

        public Item.Produto? ObterProduto(int iditem)
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT Item.item_id, Item.item_nome, Item.item_valor, Produto.produto_codbarra as item_codbarra
                                FROM Item
                                INNER JOIN Produto ON Item.item_id = Produto.item_id
                                WHERE Item.item_id = @id";

            cmd.Parameters.AddWithValue("@id", iditem);

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            Item.Produto? produto = null;
            if (dr.Read())
            {

                produto = new Item.Produto()
                {
                    id = Convert.ToInt32(dr["item_id"]),
                    nome = dr["item_nome"].ToString(),
                    valor = (float)dr["item_valor"],
                    cod_barra = dr["item_codbarra"].ToString()
                };
            }
            conn.Close();

            return produto;
        }

        public Item.Servico ObterServico(int idservico)
        {
            var conn = _bd.CriarConexao();

            MySqlCommand cmd = conn.CreateCommand();

            cmd.CommandText = $@"SELECT Item.item_id, Item.item_nome, Item.item_valor, Servico.servico_disponivel as item_disponivel
                                FROM Item
                                INNER JOIN Servico ON Item.item_id = Servico.item_id
                                WHERE Item.item_id = @id
            ";

            cmd.Parameters.AddWithValue("@id", idservico);

            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }

            MySqlDataReader dr = cmd.ExecuteReader();
            Item.Servico? servico = new Item.Servico();
            if (dr.Read())
            {

                servico = new Item.Servico()
                {
                    id = Convert.ToInt32(dr["item_id"]),
                    nome = dr["item_nome"].ToString(),
                    valor = (float)dr["item_valor"],
                    disponivel = (bool)dr["item_disponivel"]
                };
            }
            conn.Close();

            return servico;
        }

        public bool DeletarProduto(int id)
        {
            bool sucesso = false;

            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();

            cmd.CommandText = $@"delete from produto where item_id = @id;
                                    delete from item where item_id = @id;
            ";

            cmd.Parameters.AddWithValue("@id", id);
            try {

                if (conexao.State != System.Data.ConnectionState.Open)
                    conexao.Open();

                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();

                

                sucesso = true;
            }
            catch(Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }
            
            return sucesso;
        }

        public bool DeletarServico(int id)
        {
            bool sucesso = false;

            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();
            cmd.CommandText = $@"delete from servico where item_id = @id;
                                    delete from item where item_id = @id;";

            cmd.Parameters.AddWithValue("@id", id);
            try
            {
                if (conexao.State != System.Data.ConnectionState.Open){
                    conexao.Open();
                }
                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();

                sucesso = true;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }
            return sucesso;
        }

        public bool AtualizarItem(Entities.Item item)
        {
            bool sucesso = false;

            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();

            cmd.CommandText = $@"update item set item_nome = @item_nome, item_valor = @item_valor where item_id = @item_id";

            cmd.Parameters.AddWithValue("@item_nome", item.nome);
            cmd.Parameters.AddWithValue("@item_valor", item.valor);
            cmd.Parameters.AddWithValue("@item_id", item.id);
            try
            {
                if (conexao.State != System.Data.ConnectionState.Open)
                    conexao.Open();

                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();

                sucesso = true;
            }
            catch
            {

            }
            finally
            {
                conexao.Close();
            }
            return sucesso;
        }

        public bool AtualizarProduto(Entities.Item.Produto p)
        {
            bool sucesso = false;

            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();
            cmd.CommandText = $@"update produto set produto_codbarra = @produto_codbarra where item_id = @item_id";

            cmd.Parameters.AddWithValue("@produto_codbarra", p.cod_barra);
            cmd.Parameters.AddWithValue("@item_id", p.id);

            try
            {
                if (conexao.State != System.Data.ConnectionState.Open)
                    conexao.Open();

                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();

                sucesso = true;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }
            return sucesso;
        }

        public bool AtualizarServico(Entities.Item.Servico s)
        {
            bool sucesso = false;

            var conexao = _bd.CriarConexao();

            MySqlCommand cmd = conexao.CreateCommand();
            cmd.CommandText = $@"update item set servico_disponivel = @servico_disponivel where item_id = @item_id";

            cmd.Parameters.AddWithValue("@servico_disponivel", s.disponivel);
            cmd.Parameters.AddWithValue("@item_id", s.id);
            try
            {
                if (conexao.State != System.Data.ConnectionState.Open)
                    conexao.Open();

                int qtdeLinhasAfetadas = cmd.ExecuteNonQuery();

                sucesso = true;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                conexao.Close();
            }
            return sucesso;
        }
    }
}
