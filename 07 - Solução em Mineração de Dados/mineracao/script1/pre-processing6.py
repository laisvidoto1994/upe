#Universidade de Pernambuco (UPE)
#Escola Politecnica de Pernambuco (Poli)
#Curso de Especializacao em Ciencia dos Dados e Analytics
#Disciplina de Solucoes em Mineracao de dados
#--------------------------------------------------------
#Script para converter dados categoricos em binarios
#--------------------------------------------------------


# Importando as bibliotecas necessarias
import pandas
import numpy

# Define the headers since the data does not have any
nomes = ["symboling", "normalized_losses", "make", "fuel_type", "aspiration",
         "num_doors", "body_style", "drive_wheels", "engine_location",
         "wheel_base", "length", "width", "height", "curb_weight",
         "engine_type", "num_cylinders", "engine_size", "fuel_system",
         "bore", "stroke", "compression_ratio", "horsepower", "peak_rpm",
         "city_mpg", "highway_mpg", "price"]

# Read in the CSV file and convert "?" to NaN
df = pandas.read_csv("http://mlr.cs.umass.edu/ml/machine-learning-databases/autos/imports-85.data",
                  header=None, names=nomes, na_values="?" )

print("Dados originais")
print(df.head())

print(df.dtypes) 

print("selecionar apenas as colunas que sao do tipo objeto/categorigos")
obj_df = df.select_dtypes(include=['object']).copy()
print(obj_df.head())

print("verificar a existencia de dados ausentes")
print(obj_df[obj_df.isnull().any(axis=1)])

print("realiza a contagem de dados de um atributo")
print(obj_df["num_doors"].value_counts())

print("realiza o preenchimento NaN com um valor especifico")
obj_df = obj_df.fillna({"num_doors": "four"})

print(pandas.get_dummies(obj_df, columns=["drive_wheels"]).head())
dfb = pandas.get_dummies(obj_df, columns=["drive_wheels"]);

print(pandas.get_dummies(dfb, columns=["body_style"]).head())

