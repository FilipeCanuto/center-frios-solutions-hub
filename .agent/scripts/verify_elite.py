import subprocess
import sys
import os

def run_audit(name, command):
    print(f"\n🚀 Running {name}...")
    # Join command list into string for Windows shell
    cmd_str = " ".join(command)
    try:
        result = subprocess.run(cmd_str, capture_output=True, text=True, shell=True)
        print(result.stdout)
        if result.stderr:
            print(f"Errors:\n{result.stderr}")
        return result.returncode == 0
    except Exception as e:
        print(f"Failed to run {name}: {e}")
        return False

def main():
    # Use absolute or relative paths correctly
    root = "."
    scripts_base = ".agent/skills"
    
    audits = [
        ("CODE QUALITY (LINT)", ["python", f"{scripts_base}/lint-and-validate/scripts/lint_runner.py", root]),
        ("LOGIC VALIDATION (TESTS)", ["python", f"{scripts_base}/testing-patterns/scripts/test_runner.py", root]),
        ("UX PSYCHOLOGY (LAWS)", ["python", f"{scripts_base}/frontend-design/scripts/ux_audit.py", root]),
        ("AURA ELITE (BRANDING)", ["python", f".agent/aura/skills/visual-synthesis/scripts/aura_audit.py", root])
    ]
    
    success_count = 0
    for name, cmd in audits:
        if run_audit(name, cmd):
            success_count += 1
            print(f"✅ {name} PASSED")
        else:
            print(f"❌ {name} FAILED")
            
    print("\n" + "="*50)
    if success_count == len(audits):
        print("🏆 ELITE STATUS CONFIRMED: Project meets all disruptive standards.")
        sys.exit(0)
    else:
        print(f"⚠️ QUALITY GAP: {len(audits) - success_count} audits failed. Project needs refinement.")
        sys.exit(1)

if __name__ == "__main__":
    main()
