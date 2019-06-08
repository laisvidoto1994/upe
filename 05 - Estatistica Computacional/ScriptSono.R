install.packages("readr")
install.packages("dplyr")
library(readr)
library(dplyr)

# Carregando o dataset
df_sono <- read_csv("sono.csv")
dim(df_sono)

#contando a quantidade de vezes que a cidade aparece
count(df_sono, cidade)

# Mostrar a base com x linhas
sample_n(df_sono, size = 10)


# Filtrando de acordo com uma vari??vel - filter()
filter(df_sono, sono_total >= 16)
filter(df_sono, sono_total >= 16, peso >= 80)
filter(df_sono, cidade %in% c("Recife", "Curitiba"))

# arrange()
df_sono %>% arrange(sono_total) %>% head

arrange(df_sono,desc(peso))
df_sono %>% group_by(cidade)

df_sono %>% 
  select(nome, cidade, sono_total) %>%
  arrange(cidade, sono_total) #%>% head

df_sono %>% 
  select(nome, cidade, sono_total) %>%
  arrange(cidade, sono_total) %>% 
  filter(sono_total >= 16)

df_sono %>% 
  select(nome, cidade, sono_total) %>%
  arrange(cidade, desc(sono_total)) %>% 
  filter(sono_total >= 16)


# summarize()
df_sono %>% 
  summarise(media_sono = mean(sono_total))

df_sono %>% 
  summarise(media_sono = mean(sono_total), 
            min_sono = min(sono_total),
            max_ssono = max(sono_total),
            total = n())
