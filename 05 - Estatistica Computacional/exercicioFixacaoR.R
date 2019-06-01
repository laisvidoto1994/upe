
exercicio


#CO2 , warpbreaks, volcano, trees


# 1º)Descrever as variaveis da base
#air.flow->fluxo de ar
#water.temp->temperatura da água
#acid. conc.->ácido. conc.
#stack. loss->pilha. perda
# quanto maior o fluxo de ar, será maior a temperatura da água e das outras colunas

# 2º)Carregar os dados
data("stackloss")

# 3º)Transformar em frame
dados = data.frame(stackloss)
 
# 4º)mostrar os dados 
dados 

# 5º) colocar os dados na tabela
air   = table(dados$Air.Flow)
water = table(dados$Water.Temp)
acid  = table(dados$Acid.Conc.)
stack = table(dados$stack.loss)

# 6º)calcular as estatisticas descritivas sumarizadas
vetorAir=c(dados$Air.Flow) 
variavel=var(vetorAir)
# tamanho do vetor
tamanho=length(vetorAir)
# maior valor do vetor
numeroMaximo=max(vetorAir)
# menor valor do vetor
numeroMinimo=min(vetorAir)
# soma de todos os valores do vetor
total=sum(vetorAir)
#mediana
mediana=median(vetorAir)
#media
media = mean(vetorAir)
#amplitude da amostra
amplitude=range(vetorAir)
summary(vetorAir)
CV=variavel/media
# Desvio padrão
sd(vetorAir) 
#quartile
quantile(vetorAir)

# 7º)classificar em variaveis quantitativas e qualitativas
#air.flow->fluxo de ar->Quantitativa Continua
#water.temp->temperatura da água->Quantitativa Continua
#acid. conc.->ácido. conc.->Quantitativa Continua
#stack. loss->pilha. perda->Quantitativa Continua

# 8º)discutir os resultados das variaveis descritas anteriormente
#são representações de temperatura

# 9º)construir graficos
vetorAir = c(dados$Air.Flow) 
vetorWater = c(dados$Water.Temp) 
vetorAcid = c(dados$Acid.Conc.)
vetorStack = c(dados$stack.loss)
#grafico de disperção
plot(vetorAir,vetorWater)
# grafico de barra
barplot(air)
#grafico de pizza
pie(air, main="grafico de pizza")
#grafico de repersentação de quadris
boxplot(dados$Air.Flow, dados$Water.Temp,dados$Acid.Conc.,dados$stack.loss, main="grafico de quadris") 
#grafico histograma
hist(dados$Air.Flow, main="grafico de histograma")

# 10º)correlação
#quanto maior o fluxo de ar, será maior a temperatura da água

#correlação dos dados da tabela para construir á matriz
 correlacao = cor(stackloss)

# carregando biblioteca corrplot
library(corrplot)
 
# criação da correlação da matriz da biblioteca corrplot usando os dados da tabela
 corrplot(correlacao, method = "circle",bg = "lightgreen")
 





