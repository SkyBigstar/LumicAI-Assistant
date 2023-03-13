from flask import Flask, request
from flask_cors import CORS
from PyPDF2 import PdfReader
import openai
import os
import pinecone

app = Flask(__name__)
CORS(app)
openai.organization="org-giKiFSZqT0aJEZnOEFotXeK8"  
   # get this from top-right dropdown on OpenAI under organization > settings
openai.api_key = "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"
pinecone.init(
      api_key="dc92a7bf-d8ac-4698-a424-a7b73b88a9c2",
      environment="us-east1-gcp"
   )
MODEL= "text-embedding-ada-002"
@app.route('/api/ai/personal/embedding',methods = ['POST'])
def root():
   pdffile=request.files['pdfFile']

   reader=PdfReader(pdffile)
   number_of_pages=len(reader.pages)
   page=''
   for x in range(number_of_pages):
      page += reader.pages[x].extract_text().replace('\n','')
   paragraph = page.split('.  ')
  
   # get API key from top-right dropdown on OpenAI website

   openai.Engine.list()  # check we have authenticated

   if 'openai' not in pinecone.list_indexes():
      pinecone.create_index('openai', dimension=1536)
   else:
      pinecone.delete_index('openai')
      pinecone.create_index('openai', dimension=1536)
   index=pinecone.Index('openai')
   from tqdm.auto import tqdm

   count = 0  # we'll use the count to create unique IDs
   batch_size = 32  # process everything in batches of 32
   for i in tqdm(range(0, len(paragraph), batch_size)):
      # set end position of batch
      i_end = min(i+batch_size, len(paragraph))
      # get batch of lines and IDs
      lines_batch = paragraph[i: i+batch_size]
      ids_batch = [str(n) for n in range(i, i_end)]
      # create embeddings
      res = openai.Embedding.create(input=lines_batch, engine=MODEL)
      embeds = [record['embedding'] for record in res['data']]    
      # prep metadata and upsert batch
      meta = [{'text': line} for line in lines_batch]
      to_upsert = zip(ids_batch, embeds, meta)
      # upsert to Pinecone    
      index.upsert(vectors=list(to_upsert))

   return ''
@app.route('/api/ai/personal/context',methods = ['POST'])
def context():
   query = request.form['query']
   if 'openai' in pinecone.list_indexes():
      xq = openai.Embedding.create(input=query, engine=MODEL)['data'][0]['embedding']
      index=pinecone.Index('openai')
      res = index.query([xq], top_k=5, include_metadata=True)
      result1 = ''
      result2 = ''
    #  result="GPT response:"+"\n"+query+"\n\n"+"Context Items Applied"+"\n"
      for match in res['matches']:
         result1 += "-matchscore: "+f"{match['score']:.2f} \n"
         result1 += match['metadata']['text']+"\n"
         result2 += match['metadata']['text']+"\n\n"
      return [result1,result2]
   else:
      return ''
  
if __name__ == '__main__':
   app.run(port=3081, debug=True) 