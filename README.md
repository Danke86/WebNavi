# WebNavi
Speech-to-Intent Web Extension using a Fine-Tuned Large Language Model

install dependencies
```
pip install torch==2.7.1 torchvision==0.22.1 torchaudio==2.7.1 --index-url https://download.pytorch.org/whl/cu128

pip install torch transformers datasets peft accelerate bitsandbytes

pip install "unsloth[cu128-torch271]"  # adjust CUDA version if needed

pip install python-multipart

```