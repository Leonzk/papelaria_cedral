using MySql.Data.MySqlClient;

namespace papelaria_backend
{
    public class BD
    {
        public MySqlConnection CriarConexao()
        {
            string strCon = "Server=localhost;Database=papelaria;Uid=root;Pwd=Tvtlnbks09";
            //string strCon = Environment.GetEnvironmentVariable("CONNECTION_STRING");
            MySqlConnection conexao = new MySqlConnection(strCon);

            return conexao;
        }
    }
}