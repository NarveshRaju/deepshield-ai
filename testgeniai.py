import google.generativeai as genai
genai.configure(api_key="AIzaSyCVmJnVcSrA4TNyxxe1PLtYy0OBR0nP26Y")
for m in genai.list_models():
    if "generateContent" in m.supported_generation_methods:
        print(m.name)
