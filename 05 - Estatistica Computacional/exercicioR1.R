# 1º)Um artigo no Journal of Structural Engineering (Vol. 115, 1989)
# descreve um experimento para testar a resistência resultante em
# tubos circulares com calotas soldadas nas extremidades. 
# Os primeiros resultados são: 96; 96; 102; 102; 102;104; 104; 108; 126; 126; 128; 128; 140; 156; 160; 160; 164 e 170.
# Pede-se:
# a) Calcule a média e mediana da amostra e dê uma interpretação.
# b) Calcule os percentis 9%, 25%, 5% e 69%.
# c) Calcule o segundo quartil ou mediana.
# d) Calcule a amplitude da amostra.
# e) Calcule a variância e o desvio padrão da amostra.
# f) Qual a fonte de maior variabilidade deste experimento.
 
#valores
vetor=c(96,96,102,102,102,104,104,108,126,126,128,128,140,156,160,160,164,170)

#  MEDIA->mean(A) OU sum(A)/length(A)
media=mean(vetor)
print("media:")
print(media)
#mediana
mediana=median(vetor)
#d) Calcule a amplitude da amostra
amplitude=range(vetor)
#porcentagens que eu queira enquadrar
#b) Calcule os percentis 9%, 25%, 5% e 69%
percentis=c(.09, .25, .05, .69)
perc=quantile(vetor,percentis)
sd(vetor)
variavel=var(vetor)
# tamanho do vetor
tamanho=length(vetor)
# maior valor do vetor
numeroMaximo=max(vetor)
# menor valor do vetor
numeroMinimo=min(vetor)
# soma de todos os valores do vetor
total=sum(vetor)
# amostra de dados
dadosSumarizados=summary(vetor)

#se tem pouca variedade entre a media e a mediana


#################################
# 2º)na sala dos professores da escola, há um cartaz com a frase "Em 2007, eram 734 estudantes matriculados;
#em 2008, 753; em 2009, 777; em 2010, 794; e, em 2011, 819”. 

  
#valores
vetorAno = c( 2007,2008,2009,2010,2011)
vetorMatriculado = c( 734,753,777,794,819)

# construção de grafico
plot(vetorAno,vetorMatriculado,main = "teste", type="o", col="blue",lwd=3 , xlab="matriculado", ylab="ano", sub="subtitulo do grafico")

# para saber  mais informações ?
?plot
 

#################################
#pegue os dados de Titanic que já existe internamente
data(Titanic)

#carregue os dados
Titanic[1,]
 
# carregue os dados da tabela Titanic na variavel a
a=data.frame(Titanic)

#pegue os dados referente á Sexo e as coloque na variavel sexo
sexo=table(a$Sex)

#mostra e constri o grafico separando as categorias do sexo como feminino e masculino
barplot(sexo)

#pegue os dados referente á Freq e as coloque na variavel freq
freq=table(a$Freq)

#mostra e constri o grafico separando as categorias do sexo como feminino e masculino
barplot(freq)

#pegue os dados referente á Age e as coloque na variavel age
age=table(a$Age)

#mostra e constri o grafico separando as categorias do sexo como feminino e masculino
barplot(age)

#pegue os dados referente á Age e as coloque na variavel age
survived=table(a$Survived)

#mostra e constri o grafico separando as categorias do sexo como feminino e masculino
barplot(survived)

 
#################################

data(iris)
 
# carregue os dados da tabela iris na variavel b
b=data.frame(iris)

clas=table(b$Species)

# construindo grafico de pizza
pie(clas,main="titulo")


#################################

?lynx


plot(lynx)


plot(lynx, ylab="plot com dataframe", xlab="")

plot(lynx, ylab="plot com dataframe", xlab="observações")

plot(lynx, main="plot com dataframe", col="red")



#################################

data(cars)

# carregue os dados da tabela iris na variavel c
c=data.frame(cars)

# grafico de histograma
hist(c$speed)
 
# obriga a criar com 10 colunas
hist(c$speed,breaks = 10)
# criando os intervalos das colunas
hist(c$speed,breaks = c(0,5,10,20,30) )

hist(c$speed,breaks = c(0,5,10,20,30), main="teste" )

 
#################################

data(cars)

# carregue os dados da tabela iris na variavel c
d=data.frame(cars)

boxplot(d$speed, d$dist) 
  
boxplot(d$speed, d$dist, col = c("orange","yellow")) 
 
boxplot(d$speed, d$dist, col = c("orange","yellow"), main="teste") 

 
#################################


