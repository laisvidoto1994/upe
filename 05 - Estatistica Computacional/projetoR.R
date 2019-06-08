#projeto usando 
#http://archive.ics.uci.edu/ml/datasets/Auto+MPG


#Attribute Information:
  
#1. mpg: contínuo->consumo de combustível do ciclo urbano em milhas por galão
#2. cilindros: discreto com vários valores 
#3. deslocamento: contínuo 
#4. cavalo-vapor: contínuo 
#5. peso: contínuo 
#6. aceleração: contínuo 
#7. ano modelo: discreto com múltiplos valores 
#8. origem: discreto com múltiplos valores 
#9. nome do carro: string (único para cada instância)

# LEITURA DE DIRETORIO
getwd()

setwd("C:/Users/pos/Downloads")

# leia os dados do arquivo e venha com o cabeÃ§alho
dados = read.table("auto-mpg.txt", header = TRUE)

#renomeando o nome das colunas da tabela
colnames(dados) = c("mpg", "cilindros", "deslocamento", "cavaloVapor", "peso", "aceleracao", "anoModelo","origem", "nomeCarro" )
 
#media
media = mean()

#mediana
mediana = median()

boxplot(dados$mpg ~ dados$cilindros)

# para saber qual tem o maior colera��o entre a coluna mpg
corelacaoDeMPG = cor(dados$mpg, dados$cilindros)

#conseguir comparar dados de consumo de gasolina com mpg e depois cilindros e deslocamento
comparacao = aov(dados$mpg ~ dados$cilindros + dados$deslocamento)

summary(comparacao)

#diagrama de dispersao
plot(dados$mpg, dados$cilindros, main = "teste", type ='o', col='blue', lwd=3)



